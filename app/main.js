var express = require('express'),
    port = 9004,
    app = express(),
    fs = require('fs'),
    MongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID,
    async = require('async'),
    _ = require('underscore'),
    argv = require('optimist').argv,
    host = argv.host || '172.16.126.59',
    connectionString = 'mongodb://' + host + ':27017/linkedin-tmp',
    dbChar;

// define api
app.get('/', function (req, res) {
  var html = fs.readFileSync('./index.html');

  res.send(html.toString());
});

app.get('/fetch', function (req, res) {
  var status = req.query.status || 'all',
      queryCommand = {};

  // build query command
  if (status === 'active')
    queryCommand.isFixed = {$ne: true};
  else if (status === 'inactive')
    queryCommand.isFixed = true;

  // query
  dbChar.find(queryCommand).toArray(function (err, data) {
    res.send(data);
  });
});

app.get('/submit', function (req, res) {
  var id = req.query.id,
      value = req.query.value;
  
  // update at fixed
  if (!id || !value)
    res.send({error: 'missing params'});

  var queryCommand = {'_id': new ObjectID(id) },
      updateCommand = {
        '$set': {
          'escapeString': value,
          'updatedAt': new Date,
          'isFixed': true
        }
      };

  dbChar.update(queryCommand, updateCommand, function (err, data) {
    console.log('updated', queryCommand, updateCommand);
    
    if (err)
      res.send({'ok': false});
    else
      res.send({'ok': true});
  });
});

// connect db
async.waterfall([
  function (cb) {
    MongoClient.connect(connectionString, function (err, db) {
      if (!err)
        dbChar = db.collection('special_character');

      cb(null);
    });
  }
], function () {
  // start server
  app.listen(9004, function () {
    console.log('server is started at port', port);
  });
});

