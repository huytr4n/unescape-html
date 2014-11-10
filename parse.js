var _ = require('underscore'),
    async = require('async'),
    fs = require('fs'),
    MongoClient = require('mongodb').MongoClient,
    dbURL = 'mongodb://172.16.126.59:27017/linkedin-tmp';

var str = fs.readFileSync('./_list.out').toString(),
    reg = new RegExp(/(\&\#[^;]*;.*::.*).*/g),
    special = str.match(reg),
    idReg = new RegExp(/::\s(.*)\s::/),
    countryReg = new RegExp(/::\s.*\s::\s(.*)/),
    charReg = new RegExp(/(\&\#[^;]*;)/g);

// unify
special = _.map(special, function (item) {
  var chars = item.match(charReg),
      id = item.match(idReg),
      country = item.match(countryReg);
  
  return {
    chars: chars,
    id: id[1],
    country: country[1]
  };
});

special = _.uniq(special, function (item) {return item.chars});

// insert special
MongoClient.connect(dbURL, function (err, db) {
  var dbChar = db.collection('special_character'),
      jobs = [];

  _.each(special, function (specialCase) {
    var chars = specialCase.chars;

    _.each(chars, function (item) {
      // find and update
      jobs.push(function (callback) {
        dbChar.findOne({'char': item}, function (err, doc) {
          if (!err && doc) {
            console.log('this case is already in');
            callback(null);

          } else if (!err) {
            dbChar.insert({
              'char': item,
              'linkedinId': specialCase.id,
              'country': specialCase.country
            }, function (err) {
              console.log('insert character', specialCase.id);
              callback(null);

            });
          }
        });
      })
    });
  });

  var limit = 20;

  setInterval(function () {
    var len = jobs.length;

    if (len > 0) {
      var end = len < limit ? len : limit,
          i = 0,
          batch = [];

      for (; i < end; i++)
        batch.push(jobs.pop())

      async.parallel(batch, function () {});
    }

  }, 1000)
});
