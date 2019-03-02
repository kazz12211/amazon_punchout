app.controller('controller', ($scope, $http, $window, $document) => {

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
        ]*/
    };
    $scope.punchoutInProgress = false;

    $scope.totalAmount = () => {
        let amount = 0;
        $scope.order.lineitems.forEach( item => {
            amount += (item.price * item.quantity);
        } );
        return Math.round(amount * 1.08);
    };

    $scope.punchout = () => {
        $scope.punchoutInProgress = !$scope.punchoutInProgress;
    };

    angular.element(document).ready( () => {
        console.log('Ready');
        let requestDate = angular.element(document.getElementsByClassName('datepicker'));
        let instances = M.Datepicker.init(requestDate, {});
        console.log(instances);
    });
});