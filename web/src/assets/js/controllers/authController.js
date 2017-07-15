app.controller("authController", ["$q", "$scope", "$stateParams", "$rootScope", "store", "authService",
    "$state", function($q, $scope, $stateParams, $rootScope, store, authService, $state) {
        $scope.working = false;
        $scope.error = false;
        $scope.user = {username: "", password: ""};
        if (store.get('session-token')) {
            authService.invalidateSession().then(function (res) {
                store.remove('session-token');
            });
        } else {
            store.remove('session-token');
        }

        $scope.login = function () {
            authService.password($scope.user.username, $scope.user.password).then(function (res) {
                store.set("session-token", res.token);
                $state.go("hub.resourceList");
            });
        }

    }]);