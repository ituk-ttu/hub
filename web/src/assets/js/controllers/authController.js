app.controller("authController", ["$q", "$scope", "$stateParams", "$rootScope",
    "$state", function($q, $scope, $stateParams, $rootScope, $state) {
        $scope.working = false;
        $scope.error = false;
        $scope.user = {username: "", password: ""};

        $scope.login = function () {

        }

    }]);