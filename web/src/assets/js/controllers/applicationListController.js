app.controller("applicationListController", ["$q", "$scope", "$stateParams", "$rootScope", "applicationService",
    "$state", function($q, $scope, $stateParams, $rootScope, applicationService, $state) {
        $scope.working = true;
        $scope.error = false;
        $scope.applications = [];

        var init = function () {
            applicationService.getAll().then(function (applications) {
                $scope.applications = applications;
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

        init();

    }]);