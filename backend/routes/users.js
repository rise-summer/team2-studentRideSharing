const express = require('express');
const router = express.Router();
const client = require('../db');
const querystring = require('querystring');
const collectionName = "Users";

//(temporary) Admin API for testing
router.delete('/', async function (req, res, next) {
    client.emptyCollection(collectionName);
    res.status(200).send("Collection " + collectionName + " is empty.");
});

//register a new user
router.post('/signup', async function (req, res, next) {
    const {email, password, firstName, lastName, contact} = req.body;
    const collection = client.dbCollection(collectionName);
    collection.findOne({
        "email": email
    }).then(function (user) {
        if (user) {//email already exists
            res.status(409).send("Email Already Exists.");
        } else {
            let userDocument = {
                "email": email,
                "password": password,
                "firstName": firstName,
                "lastName": lastName,
                "contact": contact,
                "school": "",
                "phone": "",
                "addresses": {},
                // "rides": {},
                // "vehicles": {},
                "ratingDriver": -1,
                "ratingPassenger": -1
            };

            collection.insertOne(userDocument, function (err, record) {
                if (err) {//insert a record with an existing _id value
                    console.log(err);
                    res.sendStatus(400);
                } else {
                    console.log("Record added as " + JSON.stringify(record.ops[0]));
                    res.status(201).send(JSON.stringify(record.ops[0]));//Created
                }
            });
        }
    });
});

module.exports = router;
