app.controller("mentorListController", ["$q", "$scope", "$stateParams", "$rootScope", "mentorService",
    "$state", function($q, $scope, $stateParams, $rootScope, mentorService, $state) {
        $scope.working = true;
        $scope.error = false;
        $scope.mentors = [];
        $scope.openGifs = {};

        var init = function () {
            mentorService.getAll().then(function (mentors) {
                $scope.mentors = mentors.data;
            })
        };

        init();

    }]);