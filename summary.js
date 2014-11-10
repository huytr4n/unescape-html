/**
 * Build json map from db
 */
var _ = require('underscore'),
    MongoClient = require('mongodb').MongoClient,
    dbURL = 'mongodb://172.16.126.59:27017/linkedin-tmp',
    collection = 'special_character',
    fs = require('fs');

var sum = function (objs) {
  var all = {},
      result = [];

  _.each(objs, function (obj) {
    all[obj.char] = obj.escapeString;
  });

  _.each(all, function (value, key) {
    result.push({
      'code': key,
      'symbol': value
    });
  });

  console.log(result)
  fs.writeFileSync('char.json', JSON.stringify(result, null, 4));
};

MongoClient.connect(dbURL, function (err, db) {
  if (!err) {
    db.collection(collection).find().toArray(function (err, data) {
      sum(data);
    });
  }
});
