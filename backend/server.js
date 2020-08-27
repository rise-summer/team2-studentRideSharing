const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
// const cors = require('cors');
const client = require('./db');
const app = express();
const ridesRouter = require('./routes/rides');
const usersRouter = require('./routes/users');
const vehiclesRouter = require('./routes/vehicles');
const requestsRouter = require('./routes/requests');

// configure app
app.use(logger('dev'));
// app.use(cors());
app.use(bodyParser.json());

//Root Path
app.get('/', (req, res) => {
    res.send('<h1>API is running</h1>');
});

//routes
app.use('/api/rides', ridesRouter.router);
app.use('/api/users', usersRouter);
app.use('/api/vehicles', vehiclesRouter);
app.use('/api/requests', requestsRouter);

//Connect to Mongo on start
// const uri = "mongodb+srv://<username>:<password>@<your-cluster-url>/test?retryWrites=true&w=majority";
// const uri = "mongodb://localhost:27017"; //for local db
client.connect(process.env.MONGODB_URI, function(err) {
    if(err) {
        console.log(err);
        process.exit(1);
    }
    console.log("DB Connected.");
});

//Catch 404
app.use((req, res, next) => {
    res.status(404).send('<h2 align=center>Page Not Found</h2>');
});

//find PORT in environment variables for server to run
// if not found, use PORT = 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// module.exports = app;
