'use strict';

const convert = require('xml-js');
const xmlchecker = require('xml2js');

var DEFAULT_TYPES = ['*/xml', '+xml'];

module.exports = function(bodyParser) {
  if(bodyParser.xml) {
    // We already setup the XML parser.
    // End early.
    return;
  }

  function xml(options) {
    options = options || {};

    options.type = options.type || DEFAULT_TYPES;
    if(!Array.isArray(options.type)) {
      options.type = [options.type];
    }

    var textParser = bodyParser.text(options);
    return function xmlParser(req, res, next) {

      // First, run the body through the text parser.
      textParser(req, res, function(err) {

        if(err) { return next(err); }

        if(typeof req.body !== 'string') { return next(); }

        xmlchecker.parseString(req.body, function(err, e) {
          if(err) {
            err.status = 400;
            return next(err);
          }

          var xmljson = JSON.parse(convert.xml2json(req.body, options.xmlParseOptions));
          req.body = xmljson || req.body;
          
          next();
        });
      });
    };
  }

  // Finally add the `xml` function to the bodyParser.
  Object.defineProperty(bodyParser, 'xml', {
    configurable: true,
    enumerable: true,
    get: function() {
      return xml;
    }
  });
};
