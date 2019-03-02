# XML Body Parser using xml-js library

Adds XML parsing to the [body-parser](https://github.com/expressjs/body-parser) library, so you can convert incoming XML data into a JSON representation.

This is really useful if you want to deal with plain old JavaScript objects, but you need to interface with XML APIs.

This is based on body-parser-xml package.

## Installation

```
npm install --save express body-parser body-parser-xml-json
```

## Usage

This library adds an `xml` method to the `body-parser` object.

Initialise like so:

``` js
var bodyParser = require('body-parser');
require('body-parser-xml-json')(bodyParser);
```

Once initialised, you can use it just like any other `body-parser` middleware:

``` js
var app = require('express')();
app.use(bodyParser.xml());
```

This will parse any XML-based request and place it as a JavaScript object on `req.body` for your route handlers to use.

An XML-based request is determined by the value of the `Content-Type` header. By default, any `Content-Type` header ending in `/xml` or `+xml` will be parsed as XML. For example, the following Content-Types will all match:

- `text/xml`
- `application/xml`
- `application/rss+xml`

If you need to match against a custom `Content-Type` header, pass in the `type` to match as an option (see below).

### Options

You can also pass in options:

``` js
app.use(bodyParser.xml(options));
```



#### xmlParseOptions

This option controls the behaviour of the XML parser. You can pass any option that is supported by the [xml-js](https://github.com/nashwaan/xml-js) library: [see here]

## Example

``` js
var express = require('express'),
    bodyParser = require('body-parser');

require('body-parser-xml-json')(bodyParser);

var app = express();
app.use(bodyParser.xml({
  xmlParseOptions: {
    compact: true 
  }
}));

app.post('/users', function(req, res, body) {
  // Any request with an XML payload will be parsed
  // and a JavaScript object produced on req.body
  // corresponding to the request payload.
  console.log(req.body);
  res.status(200).end();
});

```

## Motivation

This library was born out of a frustration that [express-xml-bodyparser](https://github.com/macedigital/express-xml-bodyparser), the most popular XML-parsing library for express, doesn't support the regular `body-parser` options - in particular, limiting the payload size.

This library was written to use `body-parser`'s text parser under the hood, and then passes the parsed string into the XML parser. We can therefore take advantage of `body-parser`'s regular options, and support limiting the payload size, amongst other things.

## License

MIT
