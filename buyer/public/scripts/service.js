app.service('punchoutService', PunchoutService);

const PunchoutRequestTemplate = `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE cXML SYSTEM "http://xml.cXML.org/schemas/cXML/1.1.010/cXML.dtd">
<cXML payloadID="1233444-200@ariba.acme.com"
      xml:lang="en-US" timestamp="{timestamp}">
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
            <BuyerCookie>{buyerCookie}</BuyerCookie>
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
`;

function PunchoutService($http, $filter) {
    // Create shopping cart on punchout site
    this.punchoutCreate = (buyerCookie) => {
        const timestamp = $filter('date')(new Date(), 'yyyy-MM-ddTHH:mm:ssZ');
        // Make PunchoutSetupRequest cXML
        const request = PunchoutRequestTemplate.replace('{timestamp}', timestamp).replace('{buyerCookie}', buyerCookie);
        // Post PunchoutSetupRequest to punchout site
        return $http(
            {
                method: 'POST',
                url: 'http://localhost:5000/punchout/setup',
                headers: {
                    'Content-Type': 'text/xml',
                    'Accept' : 'text/xml'
                },
                data: request
            }
        );
    };
}

PunchoutService.$inject = [
    '$http', '$filter'
];