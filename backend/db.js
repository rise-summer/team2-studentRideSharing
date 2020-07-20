const MongoClient = require('mongodb').MongoClient;

var client;

// create a connection to url and call callback()
module.exports.connect = function (url, callback) {
  if (client) {
    //connection has already been estabilished
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
      callback();
    }
  });
}

module.exports.dbCollection = function (dbName, collectionName) {
  return client.db(dbName).collection(collectionName);
}