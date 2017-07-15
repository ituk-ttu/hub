app.controller("authController", ["$q", "$scope", "$stateParams", "$rootScope", "store", "authService",
    "$state", function($q, $scope, $stateParams, $rootScope, store, authService, $state) {
        $scope.working = false;
        $scope.error = false;
        $scope.user = {username: "", password: ""};
        store.remove('jwt');

        $scope.login = function () {
            authService.password($scope.user.username, $scope.user.password).then(function (res) {
                store.set("jwt", res.token);
                $state.go("hub.resourceList");
            });
        }

    }]);