app.controller("settingsController", ["$q", "$scope", "$stateParams", "$rootScope", "settingsService", "userService",
    "$state", "store", "Notification", function($q, $scope, $stateParams, $rootScope, settingsService, userService,
        $state, store, Notification) {
        $scope.working = {
            info: false,
            password: false
        };
        $scope.sessions = [];
        $scope.deleting = null;
        $scope.user = null;

        function loadSessions() {
            settingsService.getAllSessions().then(function (sessions) {
                $scope.sessions = sessions.data;
            })
        }

        function loadUser() {
            userService.get().then(function (user) {
                $scope.user = user.data;
            });
        }

        function init() {
            loadSessions();
            loadUser();
        }

        $scope.resetInfo = function () {
            loadUser();
        };

        $scope.saveInfo = function () {
            $scope.working.info = true;
            userService.save({
                id: $scope.user.id,
                name: $scope.user.name,
                email: $scope.user.email,
                telegram: $scope.user.telegram
            }).then(function () {
                $scope.working.info = false;
                Notification.success("Andmed salvestatud!");
            })
        };

        $scope.savePassword = function () {
            $scope.working.password = true;
            userService.savePassword({
                old: $scope.password.old,
                new: $scope.password.new,
                newConfirm: $scope.password.newConfirm
            }).then(function () {
                $scope.working.password = false;
                Notification.success("Parool uuendatud!");
            })
        };

        $scope.invalidateSession = function (session) {
            $scope.deleting = session.data.id;
            settingsService.invalidateSession(session.data.id).then(function (res) {
                $scope.deleting = null;
                loadSessions();
            }).catch(function (err) {
                $scope.deleting = null;
            })
        };

        init();

    }]);