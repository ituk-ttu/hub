app.controller("applicationListController", ["$q", "$scope", "$stateParams", "$rootScope", "applicationService",
    "$state", function($q, $scope, $stateParams, $rootScope, applicationService, $state) {
        $scope.working = true;
        $scope.error = false;
        $scope.applications = [];

        var init = function () {
            applicationService.getAll().then(function (applications) {
                $scope.applications = applications.data;
            })
        };

        $scope.getStatusLabel = function (status) {
            switch (status) {
                case "WAITING":
                    return "label-primary";
                case "ACCEPTED":
                    return "label-success";
                case "REJECTED":
                    return "label-danger";
                default:
                    return "label-default";
            }
        };

        $scope.getTableRowClass = function (application) {
            if (application.status === "WAITING") {
                if (application.mentor === null) {
                    return "info";
                } else {
                    return "success";
                }
            } else {
                return "";
            }
        };

        init();

        $scope.$watch('search.mentor.mentorship.name', function() {
            if ($scope.search !== undefined && $scope.search.mentor !== undefined &&
                $scope.search.mentor.mentorship !== undefined && $scope.search.mentor.mentorship.name === "") {
                delete $scope.search.mentor.mentorship.name;
                delete $scope.search.mentor.mentorship;
                delete $scope.search.mentor;
            }
        });

    }]);