app.controller("mentorProfileController", ["$q", "$scope", "$stateParams", "$rootScope", "mentorService",
    "$state", "Notification", function($q, $scope, $stateParams, $rootScope, mentorService, $state, Notification) {
        $scope.working = true;
        $scope.error = false;
        $scope.mentor = null;
        $scope.gifOpen = false;
        $scope.photo = null;

        var init = function () {
            $scope.working = true;
            $scope.gifOpen = false;
            mentorService.getByUserId($stateParams.id).then(function (mentor) {
                $scope.photo = mentor.data.photo;
                $scope.mentor = mentor.data;
                $scope.working = false;
            })
        };

        init();

        $scope.reset = function () {
            init();
        };

        $scope.save = function () {
            $scope.working = true;
            mentorService.save($stateParams.id, $scope.mentor).then(function (data) {
                Notification.success("Mentorluse profiil salvestatud!");
                $scope.working = false;
            })
        };

        $scope.$watch('mentor.photo', function() {
            if ($scope.mentor !== null && $scope.mentor.photo !== "" && $scope.mentor.photo.base64 !== undefined) {
                $scope.photo = $scope.mentor.photo !== null ? $scope.mentor.photo.base64 : null;
            }
        });

    }]);