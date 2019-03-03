const express = require('express');
const router = express.Router();
const fs = require('fs');
const CatalogService = require('./catalog_service');
const moment = require('moment');

const CatalogUrl = "http://localhost:5000/catalog/";

function punchoutSetupResponse(punchoutRequest, res) {
    /*
        Prepare shopping cart. 
        Use punchoutRequest.buyerCookie for cart key.
        punchoutRequest.operation should be taken into account. 
    */
    CatalogService.prepareShoppingCart(punchoutRequest.buyerCookie, punchoutRequest.operation, punchoutRequest.browserFormPost).then( (result) => {
        /*
            Send PunchoutSetupResponse with StartPage.URL = http://localhost:5500/catalog/id:{cart key}
        */
        const url = CatalogUrl + punchoutRequest.buyerCookie;
        const timestamp = moment().format();
        fs.readFile('routes/resources/PunchoutSetupResponse.xml', 'utf8', (err, data) => {
            if(err) {
                res.send(err);
            } else {
                let responseXml = data.replace('{timestamp}', timestamp).replace('{url}', url);
                console.log(responseXml);
                res.header('Content-Type', 'text/xml');
                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.header('Pragma', 'no-cache');
                res.send(responseXml);
            }
        });
    }).catch ( (err) => {
        console.log(err);
        res.send(err);        
    });
}

function _get_element(data, elementName) {
    return data.elements.find( e => e.name === elementName);
}

function _get_element2(data, firstElement, secondElement) {
    return _get_element(_get_element(data, firstElement), secondElement);
}

function _get_element3(data, firstElement, secondElement, thirdElement) {
    return _get_element(_get_element2(data, firstElement, secondElement), thirdElement);
}

function punchoutSetupRequestFromData(data) {
    const root = _get_element(data, 'cXML');
    const header = _get_element(root, 'Header');
    const fromIdentity = _get_element3(header, 'From', 'Credential', 'Identity');
    const toIdentity = _get_element3(header, 'To', 'Credential', 'Identity');
    const senderIdentity = _get_element3(header, 'Sender', 'Credential', 'Identity');
    const senderSharedSecret = _get_element3(header, 'Sender', 'Credential', 'SharedSecret');
    const userAgent = _get_element2(header, 'Sender', 'UserAgent');
    const punchout = _get_element2(root, 'Request', 'PunchOutSetupRequest');
    const cookie = _get_element(punchout, 'BuyerCookie');
    const formPostURL = _get_element2(punchout, 'BrowserFormPost', 'URL');
    const supplierSetupURL = _get_element2(punchout, 'SupplierSetup', 'URL');

    var poRequest = {
        payloadId: root.attributes.payloadID,
        timestamp: root.attributes.timestamp,
        from: fromIdentity.elements[0].text,
        to: toIdentity.elements[0].text,
        sender: senderIdentity.elements[0].text,
        sharedSecret: senderSharedSecret.elements[0].text,
        userAgent: userAgent.elements[0].text,
        operation: punchout.attributes.operation,
        buyerCookie: cookie.elements[0].text,
        browserFormPost: formPostURL.elements[0].text,
        supplierSetup: supplierSetupURL.elements[0].text
    };

    return poRequest;
}

router.post('/setup', (req, res) => {
    var data = req.body;

    const punchoutRequest = punchoutSetupRequestFromData(data);

    console.log('Got PunchOutSetupRequest:');
    console.log(JSON.stringify(punchoutRequest));

    punchoutSetupResponse(punchoutRequest, res);
});


module.exports = router;

/*
cXML: PunchoutSetupRequest

<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE cXML SYSTEM "http://xml.cXML.org/schemas/cXML/1.1.010/cXML.dtd">
<cXML payloadID="1233444-200@ariba.acme.com"
      xml:lang="en-US" timestamp="1999-03-12T18:39:09-08:00">
    <Header>
        <From>
            <Credential domain="AribaNetworkUserId">
                <Identity>admin@acme.com</Identity>
            </Credential>
        </From>
        <To>
            <Credential domain="DUNS">
                <Identity>942888711</Identity>
            </Credential>
        </To>
        <Sender>
            <Credential domain="AribaNetworkUserId">
                <Identity>admin@acme.com</Identity>
                <SharedSecret>coyote</SharedSecret>
            </Credential>
            <UserAgent>Buyer App</UserAgent>
        </Sender>
    </Header>
    <Request>
        <PunchOutSetupRequest operation="create">
            <BuyerCookie>34234234ADFSDF234234</BuyerCookie>
            <Extrinsic name="randomKey">department code</Extrinsic>
            <BrowserFormPost>
                <URL>http://localhost:3000/checkout</URL>
            </BrowserFormPost>
            <SupplierSetup>
                <URL>http://workchairs.com/cxml</URL>
            </SupplierSetup>
        </PunchOutSetupRequest>
    </Request>
</cXML>

cXML: PunchoutSetupResponse

<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE cXML SYSTEM "http://xml.cXML.org/schemas/cXML/1.1.010/cXML.dtd">
<cXML payloadID="456778-199@cxml.workchairs.com"
      xml:lang="en-US" timestamp="1999-03-12T18:39:09-08:00">
    <Response>
        <Status code="200" text="OK"/>
        <PunchOutSetupResponse>
            <StartPage>
                <URL>http://localhost:5500/catalog/id:34234234ADFSDF234234</URL>
            </StartPage>
        </PunchOutSetupResponse>
    </Response>
</cXML>

*/

/*
JSON: Parsed PunchoutSetupRequest

{
    "payloadId": "1233444-200@ariba.acme.com",
    "timestamp": "1999-03-12T18:39:09-08:00",
    "from": "admin@acme.com",
    "to": "942888711",
    "sender": "admin@acme.com",
    "sharedSecret": "coyote",
    "userAgent": "Buyer App",
    "operation": "create",
    "buyerCookie": "34234234ADFSDF234234",
    "browserFormPost": "http://localhost:3000/checkout",
    "supplierSetup": "http://workchairs.com/cxml"
}

*/