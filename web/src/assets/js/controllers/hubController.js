app.controller("hubController", ["$q", "$scope", "$stateParams", "$rootScope", "store", "userService",
    "$state", function($q, $scope, $stateParams, $rootScope, store, userService, $state) {
        $scope.currentUser = null;

        $scope.reloadUser = function() {
            userService.get().then(function (user) {
                $scope.currentUser = user;
            });
        };

        $scope.reloadUser();

    }]);