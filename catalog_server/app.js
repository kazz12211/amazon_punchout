const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
var bodyParser = require('body-parser');
require('body-parser-xml-json')(bodyParser);

const url = 'mongodb://172.17.0.2:27017/catalogs';
const options = {
    useNewUrlParser: true,
    reconnectTries: 60,
    reconnectInterval: 1000
};

const app = express();

// Handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded( { extended: true} ));
app.use(bodyParser.xml());

app.use(express.static(path.join(__dirname, 'public')));

// Punchout API
app.use('/punchout', require('./routes/punchout/Punchout'));

// Catalog
app.get('/catalog/:id', (req, res) => {
    const query = {userId: req.params.id};

    MongoClient.connect(url, options, (err, client) => {
        if(err) {
            console.log(err);
        }
        const dbo = client.db('catalogs');
        console.log('Fetching shopping cart with id: ' + query.userId);
        console.log('Fetching catalog items');
        dbo.collection('catalog_items').find({}).toArray( (err, results) => {
            if(err) {
                console.log(err);
            }
            client.close();
            res.render('catalog', {
                title: 'パンチアウトカタログサーバー',
                items: results
            });
        });
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));