const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
require('body-parser-xml-json')(bodyParser);

const app = express();

app.use(express.json());
app.use(express.urlencoded( { extended: true} ));
app.use(bodyParser.xml());

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));