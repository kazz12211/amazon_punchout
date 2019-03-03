const express = require('express');
const router = express.Router();
const fs = require('fs');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const config = require('./config');
const CatalogService = require('./catalog_service');
const moment = require('moment');
const builder = require('xmlbuilder');
const request = require('request');

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
            // Post PunchoutOrderMessage contains cart content to cart.browserFormPost. 
            let xml = builder.create('cXML');
            xml.att('payloadID', '456778-198@premier.workchairs.com');
            xml.att('xml:lang', 'en-US');
            xml.att('timestamp', moment().format());
            let header = xml.ele('Header');
            header.ele('From').ele('Credential', {'domain': 'DUNS'}).ele('Identity', '942888711');
            header.ele('To').ele('Credential', {'domain' : 'AribaNetworkUserId'}).ele('Identity', 'admin@acme.com');
            let sender = header.ele('Sender');
            sender.ele('Credential', {'domain' : "DUNS"}).ele('Identity', '942888711');
            sender.ele('UserAgent', 'CatalogServer');
            let orderMessage = xml.ele('Message').ele('PunchOutOrderMessage');
            orderMessage.ele('BuyerCookie', buyerCookie);
            orderMessage.ele('PunchOutOrderMessageHeader', {'operationAllowed' : 'edit'}).ele('Total').ele('Money', {'currency' : 'JPY'}, cart.total);
            cart.items.forEach( item => {
                let itemIn = orderMessage.ele('ItemIn', {'quantity': item.quantity});
                let itemId = itemIn.ele('ItemID');
                itemId.ele('SupplierPartID', item.productId);
                itemId.ele('SupplierPartAuxiliaryID', '')
                let itemDetail = itemIn.ele('ItemDetail');
                itemDetail.ele('UnitPrice').ele('Money', {'currency' : 'JPY'}, item.price);
                itemDetail.ele('Description', item.description);
                itemDetail.ele('UnitOfMeasure', item.uom);
                itemDetail.ele('Classification', {'domain' : 'SPSC'}, 12345);
                itemDetail.ele('ManufacturerPartID', 'man-part-id');
                itemDetail.ele('ManufacturerName', '椿工藝舎');
            });
            let xmlString = xml.end({
                pretty: true,
                indent: '  ',
                newline: '\n',
                allowEmpty: false,
                spacebeforeslash: ''
            });
            //console.log(xmlString);

            const options = {
                uri: cart.browserFormPost,
                method: 'POST',
                headers: {
                    'User-Agent': 'CatalogServer',
                    'Content-Type': 'text/xml'
                },
                body: xmlString
            };

            request(options, (err, response, body) => {
                if(err) {
                    console.log(err);
                } else {
                    console.log(body);
                }
            });

            res.redirect('/cart/' + buyerCookie);
        }).catch( (err) => {
            console.log(err);
            res.redirect('/cart/' + buyerCookie);
        });
    }
};

module.exports = ShoppingCart;