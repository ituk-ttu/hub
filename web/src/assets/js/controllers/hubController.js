app.controller("hubController", ["$q", "$scope", "$stateParams", "$rootScope", "store", "jwtHelper",
    "$state", function($q, $scope, $stateParams, $rootScope, store, jwtHelper, $state) {
        $scope.tokenData = store.get('jwt') !== null ? jwtHelper.decodeToken(store.get('jwt')) : null;
    }]);