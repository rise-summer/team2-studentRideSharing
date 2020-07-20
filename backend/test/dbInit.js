// To Init the database: node ./test/dbInit.js
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://testuser:X19sp5j7kInOoyd1@cluster0.ftxhe.mongodb.net/test?retryWrites=true&w=majority";

// Use connect method to connect to the Server

MongoClient.connect(uri, { useUnifiedTopology: true } , function(err, client) {
  const db = client.db("test");
  db.collection("Rides").drop();
  // Use the collection "users"
  const col = db.collection("Rides");
  // Insert a single document
  col.insertMany([
    {
      "driverID": 0,
      "rideID": 0,
      "pickUpAddr": [0, {"address": "69 Division Ave", "city": "Victorville", "state": "CA", "zip": 92392}],
      // "destAddr": [1, "UCLA"],
      "destAddr": [0, {"city": "Los Angeles", "state": "CA", "zip": 90095}],
      "startDate": new Date(2020, 6, 23, 13, 0),//year, month (0 to 11), date, hours, minutes
      "endDate": new Date(2020, 6, 23, 14, 0),
      "price": 20.0,
      "capacity": 3,
      "car": {"model": "Toyota", "make": "Camry", "color": "White", "plate": "7AVF369"}
    },
    {
      "driverID": 1,
      "rideID": 0,
      "pickUpAddr": [0, {"address": "69 Division Ave", "city": "Victorville", "state": "CA", "zip": 92392}],
      "destAddr": [0, {"city": "Los Angeles", "state": "CA", "zip": 90095}],
      "startDate": new Date(2020, 6, 23, 14, 0),//year, month (0 to 11), date, hours, minutes
      "endDate": new Date(2020, 6, 23, 15, 0),
      "price": 15.0,
      "capacity": 1
      "car": {"model": "Toyota", "make": "Camry", "color": "White", "plate": "7AVF369"}
    },
    {
      "driverID": 1,
      "rideID": 1,
      "pickUpAddr": [0, {"address": "69 Division Ave", "city": "Victorville", "state": "CA", "zip": 92392}],
      "destAddr": [0, {"city": "Los Angeles", "state": "CA", "zip": 90095}],
      "startDate": new Date(2020, 6, 23, 13, 0),//year, month (0 to 11), date, hours, minutes
      "endDate": new Date(2020, 6, 23, 13, 50),
      "price": 10.0,
      "capacity": 2,
      "car": {"model": "Ford", "make": "Focus", "color": "Grey", "plate": "7AVF369"}
    }
  ], function(err, r) {
    client.close();
  });
});