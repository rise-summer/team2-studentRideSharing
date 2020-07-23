// To Init the database: node ./test/dbInit.js
const request = require('request');
const querystring = require('querystring');

function emptyCol(isTrue, callback=()=>{}) {
  if(isTrue) {
    request.delete('http://localhost:3000/api/Rides', {} ,(err, res, body) => {
      if(err) {
        console.error(err);
        return
      }
      console.log(body);
    })
  }
  callback();
}

function post(driverID, rideID, record, isTrue = true, callback=()=>{}) {
  if(isTrue) {
    request.post('http://localhost:3000/api/rides/'+ driverID + '/' + rideID, {
      json: record
    }, (error, res, body) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log("Record added as:\n" + JSON.stringify(body,null,2));
    })
  }
  callback();
}

function query(callback=()=>{}) {
  var query = {
                originCoords: [-119.159392, 34.164958],
                // destCoords:  [-117.221505, 32.873788 ],
                beginDate: new Date(2020, 6, 23, 13, 0),
                endDate: new Date(2020, 6, 23, 14, 0),
                distance: 5
              };
  var xurl = "http://localhost:3000/api/rides?"+querystring.stringify({'query':JSON.stringify(query)});
  request.get(xurl, {}, (error, res, body) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log("query result: " + body);
  })
  callback();
}

function getSingleRide(driverID, rideID, callback=()=>{}) {
  const URL = "http://localhost:3000/api/rides/" + driverID + "/" + rideID;
  request.get(URL, {}, (err, res, body) => {
    if(err) {
      console.error(err);
      return;
    }
    if(res.statusCode == 200) {
      console.log("Fetched " + driverID + "/" + rideID + ":\n" + JSON.stringify(JSON.parse(body),null,2));
    }
    else {
      console.log("Fetched " + driverID + "/" + rideID + ":" + body);
    }
  })
  callback();
}

var doc0 = {
  origin: {address: "4000 S Rose Ave", city: "Oxnard", state: "CA", zip: 93033, school: "Oxnard College"},
  destination: {address: "Miramar St", city: "La Jolla", state: "CA", zip: 92037},
  originCoords: {
    type: "Point",
    coordinates: [-119.159392, 34.164958]
  },//<longitude>, <latitude>
  destCoords: [-117.221505, 32.873788],
  time: new Date(2020, 6, 23, 13, 30),
  // startDate: new Date(2020, 6, 23, 13, 0),//year, month (0 to 11), date, hours, minutes
  // endDate: new Date(2020, 6, 23, 14, 0),
  price: 20.0,
  capacity: 3,
  car: {model: "Toyota", make: "Camry", color: "Black", plate: "365VKU"}
}

var doc1 = {
  origin: {"address": "1834 Kennedy Pl", "city": "Oxnard", "state": "CA", "zip": 93033},
  destination: {"address": "643 Nautilus St", "city": "La Jolla", "state": "CA", "zip": 92037},
  originCoords: {
    type: "Point",
    coordinates: [-119.158323, 34.177169]
  },//<longitude>, <latitude>
  destCoords: [-117.274471, 32.832215],
  time: new Date(2020, 6, 23, 14, 30),
  // startDate: new Date(2020, 6, 23, 14, 0),//year, month (0 to 11), date, hours, minutes
  // endDate: new Date(2020, 6, 23, 15, 0),
  price: 15.0,
  capacity: 1,
  car: {model: "Toyota", make: "Camry", color: "White", plate: "7AVF369"}
}

var doc2 = {
  origin: {"address": "833 W Santa Anita St", "city": "San Gabriel", "state": "CA", "zip": 91776},
  destination: {"city": "Los Angeles", "state": "CA", "zip": 90095},
  originCoords: {
    type: "Point",
    coordinates: [-118.111510, 34.095624]
  },//<longitude>, <latitude>
  destCoords: [-118.445198, 34.068854],
  Time: new Date(2020, 6, 23, 13, 00),
  // startDate: new Date(2020, 6, 23, 13, 0),//year, month (0 to 11), date, hours, minutes
  // endDate: new Date(2020, 6, 23, 13, 50),
  price: 10.0,
  capacity: 2,
  car: {model: "Ford", make: "Focus", color: "Grey", plate: "7AZM870"}
}

// emptyCol(true).then
emptyCol(true, function() {
  post(0, 0, doc0);
  post(1, 0, doc1);
  post(1, 1, doc2, true, function() {
    query( function() {
      console.log("DB Init is done.");
    });
    getSingleRide(0, 0);
    getSingleRide(1, 0);
    getSingleRide(1, 2);
  })
});
