app.controller("userListController", ["$q", "$scope", "$stateParams", "$rootScope", "userService",
    "$state", function($q, $scope, $stateParams, $rootScope, userService, $state) {
        $scope.working = true;
        $scope.error = false;
        $scope.users = [];

        var init = function () {
            userService.getAll().then(function (users) {
                $scope.users = users;
            })
        };

        init();

    }]);