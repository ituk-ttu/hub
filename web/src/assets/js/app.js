// Environment variables

if (window.location.hostname === "localhost"){
    apiBase = "http://localhost:3000";
} else {
    apiBase = "https://api.hub.ituk.ee";
}

var app = angular.module("hub", [
    "ui.router",
    "ui.utils",
    "angular-storage",
    'ui.bootstrap',
    "angularMoment",
    "ngclipboard",
    'naif.base64',
    'ui-notification'
]).run(function($rootScope, $state, $stateParams, store) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.$on('$stateChangeStart', function(e, to, params) {
        if (to.data && to.data.requiresLogin) {
            if (!store.get('session-token') || store.get('session-token') === undefined) {
                e.preventDefault();
                // TODO: save where user wanted to go
                $rootScope.navState = to;
                $rootScope.navStateParams = params;
                console.log($rootScope.navState);
                console.log($rootScope.navStateParams);
                $state.go('auth');
            }
        }
    });
}).config(function($stateProvider, $urlRouterProvider, $httpProvider, NotificationProvider) {

    $httpProvider.interceptors.push('tokenInterceptor');

    NotificationProvider.setOptions({
        delay: 3000,
        startTop: 20,
        startRight: 20,
        verticalSpacing: 20,
        horizontalSpacing: 20,
        positionX: 'left',
        positionY: 'bottom'
    });

    $urlRouterProvider
        .otherwise("/hub");
    $stateProvider
        .state("auth", {
            url: "/auth",
            templateUrl: "templates/auth.html",
            controller: "authController"
        })
        .state("recoverPassword", {
            url: "/recover",
            templateUrl: "templates/recoverPassword.html",
            controller: "recoverPasswordController",
            params: {
                email: null
            }
        })
        .state("recoverPasswordComplete", {
            url: "/password/:id/:key",
            templateUrl: "templates/recoverPasswordComplete.html",
            controller: "recoverPasswordCompleteController"
        })
        .state("hub", {
            url: "/hub",
            abstract: true,
            templateUrl: "templates/hub.html",
            controller: "hubController",
            data: {
                requiresLogin: true
            }
        })
        .state("hub.resourceList", {
            url: "",
            templateUrl: "templates/hub/resourceList.html",
            controller: "resourceListController"
        })
        .state("hub.applicationList", {
            url: "/applications",
            templateUrl: "templates/hub/applicationList.html",
            controller: "applicationListController"
        })
        .state("hub.application", {
            url: "/applications/:id",
            templateUrl: "templates/hub/application.html",
            controller: "applicationController"
        })
        .state("hub.userList", {
            url: "/users",
            templateUrl: "templates/hub/userList.html",
            controller: "userListController"
        })
        .state("hub.userAdd", {
            url: "/users/add",
            templateUrl: "templates/hub/userAdd.html",
            controller: "userAddController"
        })
        .state("hub.user", {
            url: "/users/:id",
            templateUrl: "templates/hub/user.html",
            controller: "userController"
        })
        .state("hub.settings", {
            url: "/settings",
            templateUrl: "templates/hub/settings.html",
            controller: "settingsController"
        })
        .state("hub.mentorList", {
            url: "/mentors",
            templateUrl: "templates/hub/mentorList.html",
            controller: "mentorListController"
        })
        .state("hub.mentorProfile", {
            url: "/mentors/profile/:id",
            templateUrl: "templates/hub/mentorProfile.html",
            controller: "mentorProfileController"
        });
});