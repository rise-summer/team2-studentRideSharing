// import express from 'express';
//
// const app = express();

let express = require('express');
let router = express.Router();

router.get('/', async function (req, res, next) {
     res.status(200);
     res.send("Yeah!");
})

module.exports = router;