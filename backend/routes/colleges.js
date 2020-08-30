const express = require('express');
const router = express.Router();
const client = require('../db');
const collectionName = "Colleges";

//Get List of college names for autocomplete (Not as efficiency as the other one with "limit")
// router.get('/', async function (req, res, next) {
//     const collection = client.collegeCollection(collectionName);
//     collection.aggregate([
//         {
//             $project: {
//                 text: "$institution name",
//                 value: "$institution name",
//                 key: "$_id",
//                 _id: false
//             }
//         }
//     ]).toArray(function (err,colleges) {
//         if (err) {
//             console.log(err);
//             res.sendStatus(400);
//         }
//         res.status(200).json(colleges);
//     });
// })

//Get college name autocomplete
router.get('/:words', async function (req, res, next) {
    const words = decodeURI(req.params.words);
    const collection = client.collegeCollection(collectionName);
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
            $limit: 10
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