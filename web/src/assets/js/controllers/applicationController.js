app.controller("applicationController", ["$q", "$scope", "$stateParams", "$rootScope", "applicationService",
    "$state", function($q, $scope, $stateParams, $rootScope, applicationService, $state) {
        $scope.working = true;
        $scope.error = false;
        $scope.application = {};

        var init = function () {
            applicationService.get($stateParams.id).then(function (applications) {
                $scope.application = applications;
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