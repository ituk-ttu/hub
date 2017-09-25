app.controller("applicationController", ["$q", "$scope", "$stateParams", "$rootScope", "applicationService",
    "$state", function ($q, $scope, $stateParams, $rootScope, applicationService, $state) {
        $scope.working = true;
        $scope.error = false;
        $scope.application = {};

        var init = function () {
            applicationService.get($stateParams.id).then(function (application) {
                $scope.application = application.data;
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

        $scope.getNameClass = function (status) {
            switch (status) {
                case "REJECTED":
                    return "text-danger";
                case "ACCEPTED":
                    return "text-success";
                default:
                    return "";
            }
        };

        $scope.setStatus = function (status) {
            if (status === "REJECTED") {
                swal({
                    title: 'Lükka tagasi?',
                    text: "Avaldus (" + $scope.application.name + ") lükatakse tagasi. Seda hiljem muuta pole võimalik!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonClass: 'btn btn-danger btn-popup',
                    cancelButtonClass: 'btn btn-default btn-popup',
                    confirmButtonText: 'Jah, lükka tagasi',
                    cancelButtonText: 'Katkesta',
                    buttonsStyling: false
                }).then(function () {
                    applicationService.setStatus($scope.application.id, status).then(function (application) {
                        $scope.application.status = application.data.status;
                    });
                });
            } else if (status === 'ACCEPTED') {
                applicationService.setStatus($scope.application.id, status).then(function (application) {
                    $scope.application.status = application.data.status;
                });
            }
        };

        init();

    }]);