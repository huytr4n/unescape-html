var _ = require('underscore'),
    fs = require('fs'),
    path = require('path'),
    maps = [];

try {
  maps = JSON.parse(fs.readFileSync(path.join(__dirname, '/char.json')).toString());
} catch (e) {
  console.log('can not get maps');
  console.log(e);
}

// console.log(maps);
if (_.size(maps) > 0)
  console.log('unescape is up!');

/**
 * Expose
 */
module.exports = function (str) {
  if (!str || typeof str !== "string")
    return str

  if (str.indexOf('&#') !== -1) {
    _.each(maps, function (mapCase) {
      str = str.replace(new RegExp(mapCase.code, "g"), mapCase.symbol)
    })
  }

  return str
}