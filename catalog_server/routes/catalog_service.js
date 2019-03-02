const MongoClient = require('mongodb').MongoClient;
const config = require('./config');

const CatalogService = {

    listProducts: (buyerCookie) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(config.db.url, config.db.options, (err, client) => {
                if (err) {
                    reject(err);
                } else {
                    const dbo = client.db('catalogs');
                    console.log('Fetching catalog items with buyerCookie: ' + buyerCookie);
                    dbo.collection('catalog_items').find({}).toArray((err, results) => {
                        if (err) {
                            client.close();
                            reject(err);
                        } else {
                            client.close();
                            resolve(results);
                        }
                    });
                }
            });
        });

    },

    prepareShoppingCart: (buyerCookie, operation, browserFormPost) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(config.db.url, config.db.options, (err, client) => {
                if (err) {
                    reject(err);
                }
                const dbo = client.db('catalogs');
                console.log('Finding Shopping Cart with buyerCookie (' + buyerCookie + ')');
                dbo.collection('shopping_carts').find({ buyerCookie: buyerCookie }).toArray((err, result) => {
                    if (err) {
                        client.close();
                        reject(err);
                    } else {
                        // If shopping cart not found
                        if (result.length === 0) {
                            console.log('Shopping Cart with buyerCookie (' + buyerCookie + ') not found');
                            // Create new shopping cart
                            dbo.collection('shopping_carts').insertOne({ buyerCookie: buyerCookie, items: [], browserFormPost: browserFormPost }, (err, r) => {
                                if (err) {
                                    client.close();
                                    reject(err);
                                } else {
                                    console.log('Shopping Cart with buyerCookie (' + buyerCookie + ') created');
                                    client.close();
                                    resolve(r);
                                }
                            });
                        }
                        // if shopping cart found
                        else {
                            // Clear shopping cart items
                            console.log('Shopping Cart with buyerCookie (' + buyerCookie + ') found');
                            dbo.collection('shopping_carts').updateOne({ buyerCookie: buyerCookie }, { $set: { items: [], browserFormPost: browserFormPost } }, (err, r) => {
                                if (err) {
                                    client.close();
                                    reject(err);
                                } else {
                                    console.log('Shopping Cart with buyerCookie (' + buyerCookie + ') cleared');
                                    client.close();
                                    resolve(r);
                                }
                            });
                        }
                    }
                });
            });
        });

    },

    getShoppingCart: (buyerCookie) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(config.db.url, config.db.options, (err, client) => {
                if (err) {
                    reject(err);
                } else {
                    const dbo = client.db('catalogs');
                    console.log('Fetching shopping cart with buyerCookie: ' + buyerCookie);
                    dbo.collection('shopping_carts').find({ buyerCookie: buyerCookie }).toArray((err, results) => {
                        client.close();
                        const items = results[0].items;
                        let total = 0;
                        items.forEach(item => {
                            let amt = item.quantity * item.price;
                            total = total + amt;
                        });
                        resolve({ items: items, total: Math.round(total * 1.08) })
                    });
                }
            });
        });

    },

    addToShoppingCart: (buyerCookie, data) => {
        const productId = parseInt(data.productId);

        return new Promise((resolve, reject) => {
            MongoClient.connect(config.db.url, config.db.options, (err, client) => {
                if (err) {
                    reject(err);
                } else {
                    const dbo = client.db('catalogs');
                    dbo.collection('shopping_carts').find({ buyerCookie: buyerCookie }).toArray((err, results) => {
                        if (err) {
                            client.close();
                            reject(err);
                        } else {
                            if (results.length > 0) {
                                let cart = results[0];
                                let items = cart.items;
                                let item = items.find(i => i.productId === productId);
                                if (item) {
                                    item.quantity = item.quantity + 1;
                                    item.amount = item.price * item.quantity;
                                } else {
                                    items.push(
                                        {
                                            productId: productId,
                                            name: data.name,
                                            description: data.description,
                                            price: parseInt(data.price),
                                            uom: data.uom,
                                            quantity: 1,
                                            amount: parseInt(data.price) * 1
                                        }

                                    );
                                }
                                dbo.collection('shopping_carts').updateOne({ buyerCookie: buyerCookie }, { $set: { items: items } }, (err, r) => {
                                    client.close();
                                    resolve(r);
                                });
                            }
                        }
                    });

                }
            });

        });

    },

    removeFromShoppingCart: (buyerCookie, productId) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(config.db.url, config.db.options, (err, client) => {
                if (err) {
                    reject(err);
                }
                const dbo = client.db('catalogs');
                dbo.collection('shopping_carts').find({ buyerCookie: buyerCookie }).toArray((err, results) => {
                    if (err) {
                        client.close();
                        reject(err);
                    } else {
                        if (results.length > 0) {
                            let cart = results[0];
                            let items = cart.items;
                            let index = items.findIndex(i => i.productId === productId);
                            if (index >= 0) {
                                items.splice(index, 1);
                            }
                            dbo.collection('shopping_carts').updateOne({ buyerCookie: buyerCookie }, { $set: { items: items } }, (err, r) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    client.close();
                                    resolve(r);
                                }
                            });
                        }

                    }
                });
            });

        });
    }

};

module.exports = CatalogService;