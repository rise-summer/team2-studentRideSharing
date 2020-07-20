let express = require('express');
let router = express.Router();
let client = require('../db');
// The database to use
const dbName = "test";

router.post('/rides/:userID/:rideID', async function(req, res, next){
  //TODO: validate login state - login user = given userid
  //TODO: validate input data - userID/rideID not existed in db, req body must include certain data
  const driverID = req.params.userID;
  const rideID = req.params.rideID;
  const {pickUpAddr, destAddr, startDate, endDate, price, capacity, car} = req.body;
  let rideDocument = {
    "driverID": driverID,
    "rideID": rideID,
    "pickUpAddr": pickUpAddr,
    // "destAddr": [1, "UCLA"],
    "destAddr": destAddr,
    "startDate": startDate,//year, month (0 to 11), date, hours, minutes
    "endDate": endDate,
    "price": price,
    "capacity": capacity,
    "car": car
  }
  const collection = client.dbCollection(dbName, 'Rides');
  collection.insertOne(rideDocument, function(err, record){
    if(err) {//insert a record with an existing _id value
      console.log("New Ride Error");
      res.sendStatus(400);
    }
    else {
      console.log("Record added as " + record);
      res.sendStatus(201);//Created
      //TODO: location header -> link to the generated ride
    }
  });
})

router.get('/rides', async function(req, res, next){
  //TODO: validate login state - login user = given userid
  const pickUpAddr = req.query.from;
  const destAddr = req.query.to;
  //const date = req.query.time;
  const date = new Date(2020, 6, 23, 13, 30);
  console.log("get rides leave from " + pickUpAddr + " for " + destAddr);
  const collection = client.dbCollection(dbName, 'Rides');
  collection.find({
    startDate: {$lte: date},
    endDate: {$gte: date}
  }).toArray(function(err, rides){
    if(err) {
      console.log("database find error for get /rides");
      res.sendStatus(400);
    }
    // console.log();
    res.status(200).json(rides);
  });
})

module.exports = router;