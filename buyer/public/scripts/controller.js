app.controller('controller', ($scope, $http, $window, $document, $q, punchoutService, $sce, $interval) => {

    $scope.order = {
        requester: '椿工藝舎',
        requestDate: '2019-03-02',
        title: 'ギターを購入したいです',
        lineitems: []
        /*
        lineitems: [
            {
                name: 'PHシリーズ〜響',
                price: 280000,
                quantity: 1
            }, {
                name: 'FSシリーズ〜翔',
                price: 280000,
                quantity: 1
           }
        ]
        */
    };
    $scope.punchoutInProgress = false;
    $scope.punchoutURL = '';
    $scope.isModal = false;
    $scope.buyerCookie = '34234234ADFSDF234234';
    $scope.checkouted = false;

    let task = null;

    $scope.totalAmount = () => {
        let amount = 0;
        $scope.order.lineitems.forEach( item => {
            amount += (item.unitPrice * item.quantity);
        } );
        return Math.round(amount * 1.08);
    };

    $scope.closePunchout = () => {
        $scope.punchoutURL = '';
        $scope.punchoutInProgress = false;
        $interval.cancel(task);
    };

    $scope.$watch('checkouted', (newValue, oldValue) => {
        if(newValue === true) {
            $q.all([punchoutService.consume($scope.buyerCookie)]).then( (response) => {
                $scope.order.lineitems = response[0].data.itemIns;
                console.log(response[0].data.itemIns);
                $scope.punchoutInProgress = false;
            });
        }
    });

    $scope.openPunchout = () => {

        $q.all([punchoutService.punchoutCreate($scope.buyerCookie)]).then( (response) => {
            // Parse response cXML document
            const parser = new DOMParser();
            const doc = parser.parseFromString(response[0].data, 'text/xml');
            console.log('PunchoutSetupResponse:');
            console.log(doc);
            // Get cXML content
            const cXML = doc.getElementsByTagName('cXML')[0];
            const res = cXML.getElementsByTagName('Response')[0];
            // Check Response.Status
            const statusAttrs = res.getElementsByTagName('Status')[0].attributes;
            let status = '';
            for(let i = 0; i < statusAttrs.length; i++) {
                if(statusAttrs[i].name === 'code') {
                    status = statusAttrs[i].value;
                }
            }
            if(status !== '200') {
                console.log('Error status ' + status + ' returned from catalog server');
                $scope.showModal('PunchoutSetup Transaction failed', 'Server returned status: ' + status);
            } else {
                // Get PunchOutSetupResponse
                const punchoutResponse = res.getElementsByTagName('PunchOutSetupResponse')[0];
                // Get catalog page URL
                const startPage = punchoutResponse.getElementsByTagName('StartPage')[0];
                const url = startPage.getElementsByTagName('URL')[0].textContent;
                // Make the resource URL trusted
                $scope.punchoutURL = $sce.trustAsResourceUrl(url);
                // Show iframe
                $scope.punchoutInProgress = true;

       
                task = $interval( () => {
                    $q.all([punchoutService.checkupdated($scope.buyerCookie)]).then( (response) => {
                        const res = response[0].data;
                        $scope.checkouted = res.result;
                    });
                }, 1000);
        
            }
        });
    };

    $scope.closeModal = () => {
        $scope.isModal = false;
    };

    $scope.showModal = (title, message) => {
        $scope.modalTitle = title;
        $scope.modalMessage = message;
        $scope.isModal = true;
    };


    angular.element(document).ready( () => {
    });
});