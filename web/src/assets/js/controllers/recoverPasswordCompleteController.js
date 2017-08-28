app.controller("recoverPasswordCompleteController", ["$q", "$scope", "$stateParams", "$rootScope", "store", "authService",
    "Notification", "$state", function($q, $scope, $stateParams, $rootScope, store, authService, Notification, $state) {
        $scope.working = false;
        $scope.error = false;
        $scope.password = "";
        $scope.passwordConfirm = "";


        $scope.recover = function () {
            authService.recoverComplete($stateParams.id, $stateParams.key, $scope.password, $scope.passwordConfirm)
                .then(function (res) {
                    if (res.status === 200) {
                        Notification.success("Parool muudetud!");
                        $state.go("auth");
                    } else {
                        Notification.error("Tekkis viga!");
                    }
            });
        }

    }]);