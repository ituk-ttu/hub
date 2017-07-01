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
    "angular-jwt"
]).run(function($rootScope, $state, $stateParams, store, jwtHelper) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.refreshingToken = false;

    $rootScope.$on('$stateChangeStart', function(e, to, params) {
        if (to.data && to.data.requiresLogin) {
            if (!store.get('jwt') || store.get('jwt') === undefined) {
                e.preventDefault();
                // TODO: save where user wanted to go
                $rootScope.navState = to;
                $rootScope.navStateParams = params;
                console.log($rootScope.navState);
                console.log($rootScope.navStateParams);
                $state.go('auth');
            }
        } else if (to.data && to.data.requiresAdmin) {
            if (!store.get('jwt') || store.get('jwt') === undefined) {
                if (jwtHelper.decodeToken(store.get('jwt')).admin === undefined ||
                    !jwtHelper.decodeToken(store.get('jwt')).admin) {
                    e.preventDefault();
                    $state.go('hub');
                }
            }
        }
    });
}).config(function($stateProvider, $urlRouterProvider, jwtInterceptorProvider, $httpProvider) {

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
        .state("hub.applicationList", {
            url: "/applications",
            templateUrl: "templates/hub/applicationList.html",
            controller: "applicationListController",
            data: {
                requiresAdmin: true
            }
        })
        .state("hub.application", {
            url: "/applications/:id",
            templateUrl: "templates/hub/application.html",
            controller: "applicationController",
            data: {
                requiresAdmin: true
            }
        });
});