const express = require('express');
const router = express.Router();
const client = require('../db');
const collectionName = "Colleges";

//Get college name autocomplete
router.get('/:words', async function (req, res, next) {
    const words = decodeURI(req.params.words);
    const collection = client.dbCollection(collectionName);
    collection.aggregate([
        {
            $search: {
                "autocomplete": {
                    "query": words,
                    "path": "institution name",
                    "tokenOrder": "any"
                }
            }
        },
        {
            $project: {
                text: "$institution name",
                value: "$institution name",
                key: "$_id",
                _id: false
            }
        }
    ]).toArray(function (err,colleges) {
        if (err) {
            console.log(err);
            res.sendStatus(400);
        }
        res.status(200).json(colleges);
    });
})

module.exports = router;