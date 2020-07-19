const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');

const app = express();
var apiRouter = require('./routes/api');
// configure app
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());

//Root Path
app.get('/', (req, res) => {
    res.send('<h1>API is running</h1>');
});

//routes
app.use('/api', apiRouter);

//Catch 404
app.use((req, res, next) => {
    res.status(404).send('<h2 align=center>Page Not Found</h2>');
});

//find PORT in environment variables for server to run
// if not found, use PORT = 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// module.exports = app;