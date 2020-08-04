const express = require('express');
const router = express.Router();
const client = require('../db');
const querystring = require('querystring');
const collectionName = "Requests";

//(temporary) Admin API for testing
router.delete('/', async function(req, res, next){
  client.emptyCollection(collectionName);
  res.status(200).send("Collection " + collectionName + " is empty.");
})

//add a request
router.post('/:rideID', async function(req, res, next){
  const rideID = req.params.rideID;
  const {ownerID, origin, destination, originCoords, destCoords} = req.body;
  let requestDocument = {
    "rideID": rideID,
    "ownerID": ownerID, //id of the request owner
    "status": 0, //0-pending, 1-accepted, 2-denied
    "time": new Date(),
    "startLoc": origin,//just the display name
    "endLoc": destination,
    "originCoords": originCoords,
    "destCoords": destCoords,
  }
  const collection = client.dbCollection(collectionName);
  collection.insertOne(requestDocument, function(err, record){
    if(err) {//insert a record with an existing _id value
      console.log(err);
      res.sendStatus(400);
    }
    else {
      console.log("A request record added as " + JSON.stringify(record.ops[0]));
      res.status(201).send(JSON.stringify(record.ops[0]));//Created
    }
  });
  //TODO: update other collection as well?
})

module.exports = router;