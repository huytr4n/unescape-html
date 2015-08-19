/**
 * List out all special character on production db
 */
var _ = require('underscore'),
    async = require('async'),
    Entity = require('../../../../utils/db-entity/entity'), // db entity
    moment = require('moment'),
    argv = require('optimist').argv,
    host = argv.host || '172.16.126.59',
    opts = {
      'external': [
        {
          'dbURL': 'mongodb://' + host + '/linkedin-prod',
          'collections': [
            {
              'collection': 'dbcompanies',
              'instance': 'dbCompany'
            }
          ]
        },
        {
          'dbURL': 'mongodb://' + host + '/linkedin-duplicate',
          'collections': [
            {
              'collection': 'duplicate_linkedin_id',
              'instance': 'dbDuplicate'
            },
            {
              'collection': 'request_scrapedcompanies',
              'instance': 'dbRequester'
            }
          ]
        },
        {
          'dbURL': 'mongodb://' + host + '/linkedin-tmp',
          'collections': [
            {
              'collection': 'tmp_scrapedcompanies',
              'instance': 'dbScraped'
            }
          ]
        }
      ]
    },
    source = {
      'dbURL': 'mongodb://' + host + '/linkedin-prod',
      'collection': 'dbcompanies'
    }

// new instance
var db = new Entity(opts)


setTimeout(function () {
  console.log(db.isReady)

  var instances = db.instances,
      count = 0

  // define action
  source.action = function (obj) {
    var name = obj.name;

    if (name.indexOf(';') !== -1 && name.indexOf('&#') !== -1)
      console.log(name, '::', obj.linkedinId, '::', obj.country)
      count ++
  }
  
  // run loop
  db.runLoop(source, function () {
    console.log('done!', count)
  })

}, 1000)