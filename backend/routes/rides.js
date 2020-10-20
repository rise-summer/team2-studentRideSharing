const express = require('express');
const router = express.Router();
const client = require('../db');
const querystring = require('querystring');
const collectionName = "Rides";
const ObjectId = require('mongodb').ObjectId;

//(temporary) Admin API for testing
router.delete('/', async function (req, res, next) {
    client.emptyCollection(collectionName);
    res.status(200).send("Collection " + collectionName + " is empty.");
});

//search rides
router.get('/', function (req, res, next) {
    //TODO: validate login state - login user = given userid
    //TODO: search logic for begin and end date
    //TODO: validate all params

    const {originCoords, destCoords, beginDate, endDate, distance, sortTime, orderBy} = req.query;
    const collection = client.dbCollection(collectionName);
    // const METERS_PER_MILE = 1609.34;
    const distInRadians = distance / 3963.2;//converts the distance to radians by dividing by the approximate equatorial radius of the earth
    let filter;
    let mySort;
    if (originCoords === '') {
        filter = {
            time: {$gte: new Date(beginDate), $lte: new Date(endDate)}
        };
    } else {
        filter = {
            time: {$gte: new Date(beginDate), $lte: new Date(endDate)},
            originCoords: {$geoWithin: {$centerSphere: [JSON.parse(`[${originCoords}]`), distInRadians]}},
            destCoords: {$geoWithin: {$centerSphere: [JSON.parse(`[${destCoords}]`), distInRadians]}}
        }
    }
    if (sortTime && orderBy) {
        mySort[sortTime] = orderBy === 'desc' ? -1 : 1
    }

    collection.find(filter).sort(mySort)
        // collection.find({
        //   time: {$gte: beginDate, $lte: endDate},
        //   originCoords:
        //     {
        //       $near: {
        //         $geometry: {
        //           type: "Point",
        //           coordinates: originCoords
        //         },
        //         $maxDistance: distance * METERS_PER_MILE
        //       }
        //   },
        //   destCoords:
        //     {
        //       $near: {
        //         $geometry: {
        //           type: "Point",
        //           coordinates: destCoords
        //         },
        //         $maxDistance: distance * METERS_PER_MILE
        //       }
        //     }
        // })
        .toArray(function (err, rides) {
            if (err) {
                console.log(err);
                res.sendStatus(400);
            }
            // console.log();
            res.status(200).json(rides);
        });
});

//post a new ride
router.post('/:userID', async function (req, res, next) {
    //TODO: validate login state - login user = given userid
    //TODO: validate input data - userID/rideID not existed in db, req body must include certain data
    const driverID = req.params.userID;
    // const rideID = req.params.rideID;
    const {origin, destination, originCoords, destCoords, time, price, capacity, car} = req.body;
    let rideDocument = {
        "driverID": driverID,
        "status": 0,
        "startLoc": origin,//{"address": "4000 S Rose Ave", "city": "Oxnard", "state": "CA", "zip": 93033, "school": "", "display":""}
        "endLoc": destination,
        "originCoords": originCoords,
        "destCoords": destCoords,
        "time": new Date(time),//new Date(year, month (0 to 11), date, hours, minutes)
        "price": price,
        "capacity": capacity,
        "car": car,
        "requests": []
    }
    const collection = client.dbCollection(collectionName);
    collection.insertOne(rideDocument, function (err, record) {
        if (err) {//insert a record with an existing _id value
            console.log("New Ride Error");
            res.sendStatus(400);
        } else {
            console.log("Record added as " + JSON.stringify(record.ops[0]));
            res.setHeader("Location", "/api/rides/" + driverID + "/" + record.ops[0]["_id"]);
            res.status(201).send(JSON.stringify(record.ops[0]));//Created
            //TODO: location header -> link to the generated ride
        }
    });
});

//get a single ride
router.get('/:userID/:rideID', async function (req, res, next) {
    //should be available for all?
    // const driverID = req.params.userID;
    const rideID = req.params.rideID;
    if (ObjectId.isValid(rideID)) {
        getRide(rideID, function (ride) {
            if (ride) {
                res.status(200).json(ride);
            } else {
                res.status(404).send("There is no such a ride with id " + rideID);
            }
        });
    } else {
        res.status(400).send("Invalid rideID (not ObjectId) for getting a single ride.");
    }
});

function getRide(rideID, callback) {
    const collection = client.dbCollection(collectionName);
    collection.findOne({
        "_id": ObjectId(rideID)
    }).then(function (ride) {
        callback(ride);
    });
}

//delete a ride with no pending/confirmed requests
router.delete('/:userID/:rideID', async function (req, res, next) {
    const driverID = req.params.userID;
    const rideID = req.params.rideID;
    if (ObjectId.isValid(rideID)) {
        const collection = client.dbCollection(collectionName);
        collection.deleteOne({
            "_id": ObjectId(rideID),
            "status": 0 //cannot delete cancelled(2) or completed(1) ride
        }).then(function (rep) {
            if (rep["deletedCount"] == 1) {
                res.status(200).send("Ride " + rideID + " is deleted.");
            } else {
                res.status(400).send("Ride " + rideID + " cannot be deleted. Either the ride doesn't exist or it's already completed/cancelled.");
            }
        });
    } else {//invalid request - rideID not ObjectId
        res.status(400).send("Invalid rideID (not ObjectId) for ride deleting request.");
    }
});

//cancel a ride
router.put('/cancel/:userID/:rideID', async function (req, res, next) {
    const driverID = req.params.userID;
    const rideID = req.params.rideID;
    const sameTimeTMR = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);//one day after current time
    if (ObjectId.isValid(rideID)) {
        const collection = client.dbCollection(collectionName);
        collection.updateOne({
            "_id": ObjectId(rideID),
            "status": 0, //cannot cancel cancelled(2) or completed(1) ride
            time: {$gt: sameTimeTMR}, //cannot cancel a ride that starts within 24 hrs
        }, {
            $set: {"status": 2}
        }).then(function (rep) {
            if (rep.modifiedCount == 1) {
                res.status(200).send("Ride " + rideID + " is cancelled.");
            } else {
                res.status(400).send("Ride " + rideID + " cannot be cancelled. Either the ride doesn't exist or it's already completed/cancelled or it's about to start.");
            }
        });
    } else {//invalid request - rideID not ObjectId
        res.status(400).send("Invalid rideID (not ObjectId) for ride cancellation request.");
    }
});

//get all rides
router.get('/:userID', async function (req, res, next) {
    const driverID = req.params.userID;
    const collection = client.dbCollection(collectionName);
    collection.find({
        driverID: driverID
    }).toArray(function (err, rides) {
        if (err) {
            console.log(err);
            res.sendStatus(400);
        }
        res.status(200).json(rides);
    });
});

module.exports = {router, getRide};
