app.controller("hubController", ["$q", "$scope", "$stateParams", "$rootScope",
    "$state", function($q, $scope, $stateParams, $rootScope, $state) {
        $scope.tokenData = $rootScope.tokenData;
    }]);