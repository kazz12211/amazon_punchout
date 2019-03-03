const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
var bodyParser = require('body-parser');
require('body-parser-xml-json')(bodyParser);
const config = require('./routes/config');
const Punchout = require('./routes/punchout');
const ShoppingCart = require('./routes/shoppingcart');

const app = express();

// Handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded( { extended: true} ));
app.use(bodyParser.xml());

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    next();
});

// Punchout API
app.use('/punchout', Punchout);

// Shopping Cart
app.get('/catalog/:id', ShoppingCart.catalog);
app.get('/cart/:id', ShoppingCart.cart);
app.post('/cart/add', ShoppingCart.add);
app.post('/cart/remove', ShoppingCart.remove);
app.get('/checkout/:id', ShoppingCart.checkout);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));