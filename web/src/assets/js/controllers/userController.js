app.controller("userController", ["$q", "$scope", "$stateParams", "$rootScope", "userService",
    "$state", function($q, $scope, $stateParams, $rootScope, userService, $state) {
        $scope.working = false;
        $scope.error = false;
        $scope.user = null;

        $scope.init = function () {
            userService.get($stateParams.id).then(function (user) {
                $scope.user = user;
            })
        };

        $scope.save = function () {
            $scope.working = true;
            userService.save($scope.user).then(function (res) {
                $scope.working = false;
            });
        };

        $scope.init();

    }]);