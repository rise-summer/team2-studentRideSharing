const express = require('express');
const router = express.Router();
const client = require('../db');
const querystring = require('querystring');
const collectionName = "Users";
const ObjectId = require('mongodb').ObjectId;
//(temporary) Admin API for testing
router.delete('/', async function(req, res, next){
  client.emptyCollection(collectionName);
  res.status(200).send("Collection " + collectionName + " is empty.");
})

//register a new user
router.post('/signup', async function(req, res, next){
  const {email, password, firstName, lastName, contact} = req.body;
  const collection = client.dbCollection(collectionName);
  collection.findOne({
    "email": email
  }).then(function(user) {
    if(user) {//email already exists
      res.status(409).send("Email Already Exists.");
    }
    else {
      let userDocument = {
        "email": email,
        "password": password,
        "firstName": firstName,
        "lastName": lastName,
        "contact": contact,
        "payment": "",//payment method
        "school": "",
        "phone": "",
        "addresses": {},
        "ratingDriver": -1,
        "ratingPassenger": -1
      }

      collection.insertOne(userDocument, function(err, record){
        if(err) {//insert a record with an existing _id value
          console.log(err);
          res.sendStatus(400);
        }
        else {
          console.log("Record added as " + JSON.stringify(record.ops[0]));
          res.status(201).send(JSON.stringify(record.ops[0]));//Created
        }
      });
    }
  });
})

//Get user's info
router.get('/:userID', async function(req, res, next) {
  const userID = req.params.userID;
  if(ObjectId.isValid(userID)){
    const collection = client.dbCollection(collectionName);
    collection.findOne({
      "_id": ObjectId(userID)
    }).then(function(user) {
    if(user) {
      res.status(200).json(user);
    }
    else {
        res.status(404).send("User " + userID + " is not found");
    }});
  }
  else {//invalid request - userID not ObjectId
    res.status(400).send("Invalid userID (not ObjectId)");
  }
})

//Update user's info
router.put('/:userID', async function(req, res, next) {
  const userID = req.params.userID;
  const body = {firstName, lastName, contact, school, phone} = req.body;
  //remove all undefined field
  Object.keys(body).forEach(key => {
  if (body[key] === undefined) {
    delete body[key];
  }
  });

  if(ObjectId.isValid(userID)){ //invalid request - userID not ObjectId
    const collection = client.dbCollection(collectionName);
    collection.updateOne({
      "_id": ObjectId(userID)
    }, {
      $set: body
    }).then(function(rep) {
      if(rep.modifiedCount == 1) {
        res.status(200).json(rep);
      }
      else {
        res.status(400).send("Bad Request: Cannot Update.");
      }
    });
  }
  else {
    res.status(400).send("Invalid userID (not ObjectId)");
  }
})

module.exports = router;