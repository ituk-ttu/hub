app.controller("userController", ["$q", "$scope", "$stateParams", "$rootScope", "userService", "Notification",
    "$state", function($q, $scope, $stateParams, $rootScope, userService, Notification, $state) {
        $scope.working = false;
        $scope.error = false;
        $scope.user = null;

        $scope.init = function () {
            userService.get($stateParams.id).then(function (user) {
                $scope.user = user.data;
            })
        };

        $scope.save = function () {
            $scope.working = true;
            userService.save($scope.user).then(function (res) {
                if ($scope.user.id === $scope.$parent.currentUser.id) {
                    $scope.$parent.reloadUser();

                }
                $scope.working = false;
                Notification.success("Kasutaja andmed salvestatud!");
            });
        };

        $scope.init();

    }]);