/**
 * List out all special character on production db
 */
var unescape = require('./index');
var text = 'Omurtak Cad No 243/31 Tekirda&#x11f;, &#xc7;orlu 59850 Turkey';

console.log(unescape(text));