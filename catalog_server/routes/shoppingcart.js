const express = require('express');
const router = express.Router();
const fs = require('fs');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const config = require('./config');
const CatalogService = require('./catalog_service');

const ShoppingCart = {

    catalog: (req, res) => {
        CatalogService.listProducts(req.params.id).then( (result) => {
            res.render('catalog', {
                title: 'パンチアウトカタログ',
                items: result,
                buyerCookie: req.params.id
            });
        }).catch( (err) => {
            console.log(err);
            res.redirect('/catalog/' + req.params.id);
        });
    },

    cart: (req, res) => {
        CatalogService.getShoppingCart(req.params.id).then( (result) => {
                res.render('cart', {
                    title: 'ショッピングカート',
                    items: result.items,
                    total: result.total,
                    buyerCookie: req.params.id
                });
            }
        ).catch( (err) => {
                console.log(err);
                res.redirect('/catalog/' + req.params.id);
            }
        );
     },

    add: (req, res) => {
        const buyerCookie = req.body.cookie;
        CatalogService.addToShoppingCart(buyerCookie, req.body).then( (result) => {
            res.redirect('/cart/' + buyerCookie);
        }).catch( (err) => {
            console.log(err);
            res.redirect('/catalog/' + buyerCookie);
        });
    },

    remove: (req, res) => {
        const buyerCookie = req.body.cookie;
        const productId = parseInt(req.body.productId);
        CatalogService.removeFromShoppingCart(buyerCookie, productId).then( (result) => {
            res.redirect('/cart/' + buyerCookie);
        }).catch( (err) => {
            console.log(err);
            res.redirect('/cart/' + buyerCookie);
        });
    },

    checkout: (req, res) => {
        const buyerCookie = req.params.id;
        CatalogService.getShoppingCart(buyerCookie).then( (cart) => {
            console.log(cart);
            // Post PunchoutOrderMessage contains cart content to cart.browserFormPost. 
            res.redirect('/cart/' + buyerCookie);
        }).catch( (err) => {
            console.log(err);
            res.redirect('/cart/' + buyerCookie);
        });
    }
};

module.exports = ShoppingCart;