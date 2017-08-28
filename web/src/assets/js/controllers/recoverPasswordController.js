app.controller("recoverPasswordController", ["$q", "$scope", "$stateParams", "$rootScope", "store", "authService",
    "Notification", "$state", function($q, $scope, $stateParams, $rootScope, store, authService, Notification, $state) {
        $scope.working = false;
        $scope.error = false;
        $scope.email = $stateParams.email === null ? "" : $stateParams.email;


        $scope.recover = function () {
            authService.recover($scope.email).then(function (res) {
                Notification.success("Vaata oma postkasti!");
                $state.go("auth");
            });
        }

    }]);