// Environment variables

if (window.location.hostname === "localhost"){
    apiBase = "http://localhost:3000";
} else {
    apiBase = "https://hub.ituk.ee/api";
}

var app = angular.module("hub", [
    "ui.router",
    "ui.utils",
    "angular-storage",
    'ui.bootstrap',
    "angularMoment",
    "ngclipboard"
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
}).config(function($stateProvider, $urlRouterProvider, $httpProvider) {

    $httpProvider.interceptors.push('tokenInterceptor');

    $urlRouterProvider
        .otherwise("/hub");
    $stateProvider
        .state("auth", {
            url: "/auth",
            templateUrl: "templates/auth.html",
            controller: "authController"
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
        .state("hub.user", {
            url: "/users/:id",
            templateUrl: "templates/hub/user.html",
            controller: "userController"
        });
});