const express = require('express');
const router = express.Router();
const client = require('../db');
const apiKey = require('../apiKey');
const querystring = require('querystring');
const collectionName = "Requests";
const sgMail = require('@sendgrid/mail');
const rides = require('./rides');
const ObjectId = require('mongodb').ObjectId;

//(temporary) Admin API for testing
router.delete('/', async function(req, res, next){
  client.emptyCollection(collectionName);
  res.status(200).send("Collection " + collectionName + " is empty.");
})

//add a request
router.post('/:rideID', async function(req, res, next){
  const rideID = req.params.rideID;
  const {ownerID, origin, destination, originCoords, destCoords, comment} = req.body;
  let requestDocument = {
    "rideID": rideID,
    "ownerID": ownerID, //id of the request owner
    "status": 0, //0-pending, 1-accepted, 2-denied
    "time": new Date(),
    "startLoc": origin,//just the display name
    "endLoc": destination,
    "originCoords": originCoords,
    "destCoords": destCoords,
    "comment": comment
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

//Update request's info - deny/confirm
router.put('/:action/:requestID', async function (req, res, next) {
    const requestID = req.params.requestID;
    const action = req.params.action;
    var status;
    if(action === "deny") {
        status = 2;
    }
    else if(action === "confirm") {
        status = 1;
    }
    if (ObjectId.isValid(requestID)) { //invalid request - requestID not ObjectId
        const collection = client.dbCollection(collectionName);
        collection.updateOne({
            "_id": ObjectId(requestID),
            "status": 0
        }, {
            $set: {status: status}
        }).then(function (rep) {
            if (rep.modifiedCount == 1) {
                res.status(200).json(rep);
            } else {
                res.status(400).send("Bad Request: Cannot Update the Request. ModifiedCount is not 1.");
            }
        });
    } else {
        res.status(400).send("Invalid requestID (not ObjectId)");
    }
})

//get all requests about a ride
router.get('/:rideID', async function(req, res, next){
  const rideID = req.params.rideID;
  const collection = client.dbCollection(collectionName);
  collection.find({
    rideID: rideID
}).toArray(function(err, requests){
    if(err) {
      console.log(err);
      res.sendStatus(400);
    }
    res.status(200).json(requests);
  });
})

//send email
router.post('/email/:rideID', async function(req, res, next){
    const rideID = req.params.rideID;
    const {driverMail, driverFirstName, driverLastName, requesterFirstName, startLoc, endLoc} = req.body;
    // using Twilio SendGrid's v3 Node.js Library
    // https://github.com/sendgrid/sendgrid-nodejs
    sgMail.setApiKey(apiKey.SENDGRID_API_KEY);
    rides.getRide(rideID, function(ride) {
      if(ride){
        const msg = {
          // to: driverMail,
          from: {
            "email": apiKey.teamEMAIL,
            "name": "Student Ride Sharing Team"
          },
          reply_to: "no-reply@ridesharing.com",
          template_id: apiKey.dynamicTemplateID,
          personalizations:[{
              "to": [
                {
                  "email": driverMail,
                  "name": driverFirstName + " " + driverLastName
                }
              ],
              "dynamic_template_data": {
                  "startLoc": startLoc,
                  "endLoc": endLoc,
                  "driverFirstName": driverFirstName,
                  "requesterFirstName": requesterFirstName,
                  "rideURL": "http://localhost:3000/ride/rideID",
                  "requestURL": "http://localhost:3000/request/requestID",
                  "acceptURL": "acceptURL",
                  "declineURL": "declineURL"
              }
          }],
          // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        };
        sgMail.send(msg)
        .then(() => {
          res.status(200).send("Email sent to " + driverMail);
        }, error => {
          console.error(error);
          if (error.response) {
            console.error(error.response.body);
          }
          res.status(400).send("SendGrid Error. Email not sent.");
        });
        // res.status(200).json(ride);
      }
      else {
        res.status(404).send("Failed to send email. There's no such a ride with id " + rideID);
      }
    });
})

module.exports = router;