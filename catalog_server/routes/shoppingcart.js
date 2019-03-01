const express = require('express');
const router = express.Router();
const fs = require('fs');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const config = require('./config');

const ShoppingCart = {

    catalog: (req, res) => {
        const query = {buyerCookie: req.params.id};
        console.log(query);
    
        MongoClient.connect(config.db.url, config.db.options, (err, client) => {
            if(err) {
                console.log(err);
            }
            const dbo = client.db('catalogs');
            console.log('Fetching catalogs with buyerCookie: ' + query.buyerCookie);
            console.log('Fetching catalog items');
            dbo.collection('catalog_items').find({}).toArray( (err, results) => {
                if(err) {
                    console.log(err);
                }
                client.close();
                res.render('catalog', {
                    title: 'パンチアウトカタログサーバー',
                    items: results,
                    buyerCookie: query.buyerCookie
                });
            });
        });
    },

    cart: (req, res) => {
        const query = {buyerCookie: req.params.id};

        console.log(query);
        MongoClient.connect(config.db.url, config.db.options, (err, client) => {
            if(err) {
                console.log(err);
            }
            const dbo = client.db('catalogs');
            console.log('Fetching shopping cart with buyerCookie: ' + query.buyerCookie);
            dbo.collection('shopping_carts').find(query).toArray( (err, results) => {
                console.log(JSON.stringify(results));
                client.close();
                const items = results[0].items;
                let total = 0;
                items.forEach(item => {
                    let amt = item.quantity * item.price;
                    total = total + amt;
                });
                res.render('cart', {
                    title: 'ショッピングカート',
                    items: items,
                    total: total,
                    buyerCookie: query.buyerCookie
                });
            });
        });
    
    },

    add: (req, res) => {
        const body = req.body;
        const productId = parseInt(body.productId);
        MongoClient.connect(config.db.url, config.db.options, (err, client) => {
            if(err) {
                console.log(err);
                client.close();
                res.redirect('/catalog/' + body.cookie);
                return;
            }
            const dbo = client.db('catalogs');
            dbo.collection('shopping_carts').find({buyerCookie: body.cookie}).toArray( (err, results) => {
                if(err) {
                    console.log(err);
                    client.close();
                    res.redirect('/catalog/' + body.cookie);
                    return;
                }
                if(results.length > 0) {
                    let cart = results[0];
                    let items = cart.items;
                    let item = items.find(i => i.productId === productId);
                    if(item) {
                        item.quantity = item.quantity + 1;
                    } else {
                        items.push(
                            {
                                productId: productId,
                                name: body.name,
                                description: body.description,
                                price: parseInt(body.price),
                                uom: body.uom,
                                quantity: 1
                            }
    
                        );
                    }
                    dbo.collection('shopping_carts').updateOne({buyerCookie: body.cookie}, {$set: {items: items}}, (err, r) => {
                        client.close();
                        res.redirect('/cart/' + body.cookie);
                    });
                }
            });
        });
    },
    remove: (req, res) => {
        const productId = parseInt(req.body.productId);
        MongoClient.connect(config.db.url, config.db.options, (err, client) => {
            if(err) {
                console.log(err);
                client.close();
                res.redirect('/cart/' + body.cookie);
                return;
            }
            const dbo = client.db('catalogs');
            dbo.collection('shopping_carts').find({buyerCookie: req.body.cookie}).toArray( (err, results) => {
                if(err) {
                    console.log(err);
                    client.close();
                    res.redirect('/cart/' + req.body.cookie);
                    return;
                }
                if(results.length > 0) {
                    let cart = results[0];
                    let items = cart.items;
                    let index = items.findIndex(i => i.productId === productId);
                    if(index >= 0) {
                        items.splice(index, 1);
                    }
                    dbo.collection('shopping_carts').updateOne({buyerCookie: req.body.cookie}, {$set: {items: items}}, (err, r) => {
                        client.close();
                        res.redirect('/cart/' + req.body.cookie);
                    });
                }
           });
        });
    }
};

module.exports = ShoppingCart;