const express = require('express');
const router = express.Router();
const client = require('../db');
const querystring = require('querystring');
const collectionName = "Vehicles";

//(temporary) Admin API for testing
router.delete('/', async function(req, res, next){
  client.emptyCollection(collectionName);
  res.status(200).send("Collection " + collectionName + " is empty.");
})

//add a car
router.post('/:userID/:carID', async function(req, res, next){
  const userID = req.params.userID;
  const carID = req.params.carID;
  const {make, model, color, plate, capacity} = req.body;
  let carDocument = {
    "userID": userID,
    "carID": Number(carID),
    "make": make,
    "model": model,
    "color": color,
    "plate": plate,
    "capacity": Number(capacity),
  }
  const collection = client.dbCollection(collectionName);
  collection.insertOne(carDocument, function(err, record){
    if(err) {//insert a record with an existing _id value
      console.log(err);
      res.sendStatus(400);
    }
    else {
      console.log("A vehicle record added as " + JSON.stringify(record.ops[0]));
      res.status(201).send(JSON.stringify(record.ops[0]));//Created
    }
  });
})

//get cars
router.get('/:userID', async function(req, res, next){
  const userID = req.params.userID;
  const collection = client.dbCollection(collectionName);
  collection.find({
    userID: userID
  }).toArray(function(err, cars){
    if(err) {
      console.log(err);
      res.sendStatus(400);
    }
    // console.log();
    res.status(200).json(cars);
  });
})

module.exports = router;