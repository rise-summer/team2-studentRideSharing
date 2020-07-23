const express = require('express');
const router = express.Router();
const client = require('../db');
const querystring = require('querystring');

//(temporary) Admin API for testing
router.delete('/:collectionName', async function(req, res, next){
  client.emptyCollection(req.params.collectionName);
  res.status(200).send("Collection " + req.params.collectionName + " is empty.");
})

//post a new ride
router.post('/rides/:userID/:rideID', async function(req, res, next){
  //TODO: validate login state - login user = given userid
  //TODO: validate input data - userID/rideID not existed in db, req body must include certain data
  const driverID = req.params.userID;
  const rideID = req.params.rideID;
  const {origin, destination, originCoords, destCoords, time, price, capacity, car} = req.body;
  let rideDocument = {
    "driverID": Number(driverID),
    "rideID": Number(rideID),
    "startLoc": origin,
    "endLoc": destination,
    "originCoords": originCoords,
    "destCoords": destCoords,
    "time": time,//year, month (0 to 11), date, hours, minutes
    "price": price,
    "capacity": capacity,
    "car": car
  }
  const collection = client.dbCollection('Rides');
  collection.insertOne(rideDocument, function(err, record){
    if(err) {//insert a record with an existing _id value
      console.log("New Ride Error");
      res.sendStatus(400);
    }
    else {
      console.log("Record added as " + JSON.stringify(record.ops[0]));
      res.status(201).send(JSON.stringify(record.ops[0]));//Created
      //TODO: location header -> link to the generated ride
    }
  });
})

//get a single ride
router.get('/rides/:userID/:rideID', async function(req, res, next){
  //should be available for all?
  const driverID = req.params.userID;
  const rideID = req.params.rideID;
  const collection = client.dbCollection('Rides');
  collection.findOne({
    driverID: Number(driverID),
    rideID: Number(rideID)
  }).then(function(ride) {
      if(ride){
        res.status(200).json(ride);
      }
      else {
        res.status(404).send("Driver " + driverID + " does not have a ride with id " + rideID);
      }
  });
})

//search rides
router.get('/rides', async function(req, res, next){
  //TODO: validate login state - login user = given userid
  //TODO: search logic for begin and end date
  const query = JSON.parse(req.query['query']);
  console.log(query);
  const originCoords = query['originCoords'];
  // const destCoords = query['destCoords'];
  const beginDate = query['beginDate'];
  const endDate = query['endDate'];
  const distance = query['distance']; // within x miles
  const collection = client.dbCollection('Rides');
  const METERS_PER_MILE = 1609.34;

  collection.find({
    time: {$gte: beginDate, $lte: endDate},
    originCoords:
      {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: originCoords
          },
          $maxDistance: distance * METERS_PER_MILE
        }
      }
  }).toArray(function(err, rides){
    if(err) {
      console.log(err);
      res.sendStatus(400);
    }
    // console.log();
    res.status(200).json(rides);
  });
})

module.exports = router;