const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
require('body-parser-xml-json')(bodyParser);
const punchout = require('./routes/punchout_handler');

const app = express();

app.use(express.json());
app.use(express.urlencoded( { extended: true} ));
app.use(bodyParser.xml());

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

app.post('/checkout', (req, res) => {
    punchout.save(req.body).then( (content) => {
        console.log(JSON.stringify(content, null, '  '));
    }).catch( (err) => {
        console.log(err);
    });
    res.send('<Status>OK</Status>');
});

app.get('/getcart/:id', (req, res) => {
    const buyerCookie = req.params.id;
    punchout.consume(buyerCookie).then( (cart) => {
        res.send(cart);
    }).catch( (err) => {
        res.send({error: error});
    });
});

app.get('/checkupdated/:id', (req, res) => {
    punchout.checkupdated(req.params.id).then( (result) => {
        console.log(result);
        res.send({result: result});
    }).catch( (err) => {
        res.send({error: err});
    });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));