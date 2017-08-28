app.controller("userAddController", ["$q", "$scope", "$stateParams", "$rootScope", "userService", "Notification",
    "$state", function($q, $scope, $stateParams, $rootScope, userService, Notification, $state) {
        $scope.working = false;
        $scope.error = false;
        $scope.user = {
            name: "",
            email: "",
            telegram: "",
            canBeMentor: false,
            admin: false
        };

        $scope.save = function () {
            $scope.working = true;
            userService.create($scope.user).then(function (res) {
                Notification.success("Kasutaja loodud!");
                $state.go("hub.userList");
            });
        };

    }]);