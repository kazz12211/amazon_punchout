
const MongoClient = require('mongodb').MongoClient;
const config = require('./config');

function _get_element(data, elementName) {
    return data.elements.find(e => e.name === elementName);
}

function _get_elements(data, elementName) {
    return data.elements.filter(e => e.name === elementName);
}


const PunchoutHandler = {

    save: (json) => {
        let content = {};

        const cxml = _get_element(json, 'cXML');
        content.payloadID = cxml.attributes.payloadID;
        content.timestamp = cxml.attributes.timestamp;

        const header = _get_element(cxml, 'Header');
        content.from = _get_element(_get_element(_get_element(header, 'From'), 'Credential'), 'Identity').elements[0].text;
        content.to = _get_element(_get_element(_get_element(header, 'To'), 'Credential'), 'Identity').elements[0].text;
        content.sender = _get_element(_get_element(_get_element(header, 'Sender'), 'Credential'), 'Identity').elements[0].text;
        content.userAgent = _get_element(_get_element(header, 'Sender'), 'UserAgent').elements[0].text;

        const message = _get_element(_get_element(cxml, 'Message'), 'PunchOutOrderMessage');
        content.buyerCookie = _get_element(message, 'BuyerCookie').elements[0].text;

        const messageHeader = _get_element(message, 'PunchOutOrderMessageHeader');
        content.currency = _get_element(_get_element(messageHeader, 'Total'), 'Money').attributes.currency;
        content.total = parseInt(_get_element(_get_element(messageHeader, 'Total'), 'Money').elements[0].text);

        content.itemIns = [];
        const itemElements = _get_elements(message, 'ItemIn');
        itemElements.forEach(elem => {
            let item = {};
            item.quantity = parseInt(elem.attributes.quantity);
            item.supplierPartID = _get_element(_get_element(elem, 'ItemID'), 'SupplierPartID').elements[0].text;
            const detail = _get_element(elem, 'ItemDetail');
            item.currency = _get_element(_get_element(detail, 'UnitPrice'), 'Money').attributes.currency;
            item.unitPrice = parseInt(_get_element(_get_element(detail, 'UnitPrice'), 'Money').elements[0].text);
            item.description = _get_element(detail, 'Description').elements[0].text;
            item.unitOfMeasure = _get_element(detail, 'UnitOfMeasure').elements[0].text;
            item.classificationDomain = _get_element(detail, 'Classification').attributes.domain;
            item.classification = _get_element(detail, 'Classification').elements[0].text;
            item.manufacturerPartID = _get_element(detail, 'ManufacturerPartID').elements[0].text;
            item.manufacturerName = _get_element(detail, 'ManufacturerName').elements[0].text;
            content.itemIns.push(item);
        });
        content.updated = true;

        return new Promise((resolve, reject) => {
            MongoClient.connect(config.db.url, config.db.options, (err, client) => {
                if (err) {
                    reject(err);
                }
                const dbo = client.db('buyer');
                dbo.collection('punchout_contents').findOneAndDelete({ buyerCookie: content.buyerCookie }, (err, result) => {
                    dbo.collection('punchout_contents').insertOne(content, (err) => {
                        if (err) {
                            client.close();
                            reject(err);
                        } else {
                            console.log('Punchout Response saved.');
                            client.close();
                            resolve(content);
                        }
                    });
                });
            });
        });
    },

    get: (buyerCookie) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(config.db.url, config.db.options, (err, client) => {
                if (err) {
                    reject(err);
                }
                const dbo = client.db('buyer');
                dbo.collection('punchout_contents').find({ buyerCookie: buyerCookie }).toArray( (err, result) => {
                    if(err) {
                        client.close();
                        reject(err);
                    } else {
                        client.close();
                        resolve(result[0]);
                    }
                });
            });
        });
    },

    consume: (buyerCookie) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(config.db.url, config.db.options, (err, client) => {
                if (err) {
                    reject(err);
                }
                const dbo = client.db('buyer');
                dbo.collection('punchout_contents').find({ buyerCookie: buyerCookie }).toArray( (err, result) => {
                    if(err) {
                        client.close();
                        reject(err);
                    } else {
                        dbo.collection('punchout_contents').findOneAndUpdate({buyerCookie: buyerCookie}, {$set: {updated: false}}, (err, r) => {
                            client.close();
                            if(err) {
                                console.log(err);
                            }
                            resolve(result[0]);
                        });
                    }
                });
            });
        });
    },

    checkupdated: (buyerCookie) => {
        return new Promise( (resolve, reject) => {
            MongoClient.connect(config.db.url, config.db.options, (err, client) => {
                if (err) {
                    reject(err);
                }
                const dbo = client.db('buyer');
                dbo.collection('punchout_contents').find({ buyerCookie: buyerCookie}).toArray( (err, result) => {
                    console.log(result);
                    if(err) {
                        client.close();
                        reject(err);
                    } else {
                        client.close();
                        resolve(result.length !== 0 && result[0].updated);
                    }
                });
            });
        });
    }
};

module.exports = PunchoutHandler;