app.controller("resourceListController", ["$q", "$scope", "$stateParams", "$rootScope", "resourceService",
    "$state", "store", function($q, $scope, $stateParams, $rootScope, resourceService, $state,
        store) {
        $scope.working = false;
        $scope.resources = [];
        $scope.editing = null;
        $scope.new = {};
        $scope.edited = {};
        $scope.deleting = null;

        var init = function () {
            resourceService.getAll().then(function (resources) {
                $scope.resources = resources.data;
            });

        };

        $scope.addNew = function () {
            $scope.new = {
                name: "",
                comment: "",
                url: ""
            };
            $scope.editing = -1;
        };

        $scope.edit = function (resource) {
            $scope.edited = resource;
            $scope.editing = resource.id;
        };

        $scope.createNew = function () {
            $scope.working = true;
            resourceService.create($scope.new).then(function (res) {
                init();
                $scope.working = false;
                $scope.editing = null;
                new Noty({
                    type: 'success',
                    text: 'Salvestatud!',
                    timeout: 500
                }).show();
            });
        };

        $scope.save = function () {
            $scope.working = true;
            resourceService.save($scope.edited).then(function (res) {
                init();
                $scope.working = false;
                $scope.editing = null;
            });
        };

        $scope.delete = function (resource) {
            $scope.deleting = resource.id;
            swal({
                title: 'Oled kindel?',
                text: "Ressurss " + resource.name + " kustutatakse",
                type: 'warning',
                showCancelButton: true,
                confirmButtonClass: 'btn btn-danger btn-popup',
                cancelButtonClass: 'btn btn-default btn-popup',
                confirmButtonText: 'Jah, kustuta',
                cancelButtonText: 'Katkesta',
                buttonsStyling: false
            }).then(function () {
                resourceService.delete(resource).then(function (res) {
                    init();
                    $scope.deleting = null;
                });
            }, function () {
                $scope.deleting = null;
                $scope.$apply();
            });
        };

        init();

    }]);