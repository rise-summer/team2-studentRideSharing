const MongoClient = require('mongodb').MongoClient;
// The database to use
const dbName = "test-jules";
const collegesDBName = "Colleges";
var client;

// create a connection to url and call callback()
module.exports.connect = function (url, callback) {
  if (client) {
    //connection has already been established
    callback();
  }
  //create a new connection
  client = new MongoClient(url, { useNewUrlParser: true,  useUnifiedTopology: true });
  client.connect(function (err) {
    if(err) {
      client = null;
      callback(err);
    }
    else {
      // create2dIndex(callback);
      callback();
    }
  });
}
// Need to create Index via Atlas WEB GUI
// var create2dIndex = function(callback) {
//   // Get the documents collection
//   var collection = client.db(dbName).collection('Rides');
//   // Create the index
//   collection.createIndex(
//     { originCoords : "2dsphere" }, function(err, result) {
//       if(err) {
//         callback(err);
//       }
//       console.log(result);
//       callback();
//   });
// };

module.exports.dbCollection = function (collectionName) {
  return client.db(dbName).collection(collectionName);
}

module.exports.collegeCollection = function (collectionName) {
  return client.db(collegesDBName).collection(collectionName);
}

module.exports.emptyCollection = function (collectionName) {
  client.db(dbName).collection(collectionName).deleteMany({});
}
