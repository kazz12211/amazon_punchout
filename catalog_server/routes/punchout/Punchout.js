const express = require('express');
const router = express.Router();
const fs = require('fs');
const parse = require('xml2js').parseString;

function punchoutSetupResponse(punchoutRequest, res) {
    /*
        Prepare shopping cart. 
        Use punchoutRequest.buyerCookie for cart key
    */
   /*
        Send PunchoutSetupResponse with StartPage.URL = http://localhost:5500/catalog/id:{cart key}
        Buyer App will 
    */
    res.send(punchoutRequest);
}

router.post('/setup', (req, res) => {
    var data = req.body;

    const root = data.elements.find( e => e.name === 'cXML');
    const payloadId = root.attributes.payloadID;
    const timestamp = root.attributes.timestamp;
    const header = root.elements.find( e => e.name === 'Header');
    const from = header.elements.find( e => e.name === 'From');
    const fromCredential = from.elements.find( e => e.name === 'Credential');
    const fromIdentity = fromCredential.elements.find( e => e.name === 'Identity');
    const to = header.elements.find( e => e.name === 'To');
    const toCredential = to.elements.find( e => e.name === 'Credential');
    const toIdentity = toCredential.elements.find( e => e.name === 'Identity');
    const sender = header.elements.find( e => e.name === 'Sender');
    const senderCredential = sender.elements.find( e => e.name === 'Credential');
    const senderIdentity = senderCredential.elements.find( e => e.name === 'Identity');
    const senderSharedSecret = senderCredential.elements.find( e => e.name === 'SharedSecret');
    const senderUserAgent = sender.elements.find( e => e.name === 'UserAgent');
    const request = root.elements.find( e => e.name === 'Request');
    const punchout = request.elements.find( e => e.name === 'PunchOutSetupRequest');
    const cookie = punchout.elements.find( e => e.name === 'BuyerCookie');
    const formPost = punchout.elements.find( e => e.name == 'BrowserFormPost');
    const formPostURL = formPost.elements.find( e => e.name === 'URL');
    const supplierSetup = punchout.elements.find( e => e.name == 'SupplierSetup');
    const supplierSetupURL = supplierSetup.elements.find( e => e.name === 'URL');

    var poRequest = {
        payloadId: payloadId,
        timestamp: timestamp,
        from: fromIdentity.elements[0].text,
        to: toIdentity.elements[0].text,
        sender: senderIdentity.elements[0].text,
        sharedSecret: senderSharedSecret.elements[0].text,
        userAgent: senderUserAgent.elements[0].text,
        operation: punchout.attributes.operation,
        buyerCookie: cookie.elements[0].text,
        browserFormPost: formPostURL.elements[0].text,
        supplierSetup: supplierSetupURL.elements[0].text
    };

    punchoutSetupResponse(poRequest, res);
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