app.factory('tokenInterceptor', function ($q, jwtHelper, store, $injector, $rootScope) {
    return {
        responseError: function (data) {
            if (data.status === 403) {
                console.log('Bye!');
                $injector.get('$state').go('auth');
            } else {
                return data;
            }
        },
        request: function(data) {
            if (data === undefined || data.headers === undefined || data.headers.Authorization === undefined) {
                data.headers.Authorization = store.get('session-token');
            }
            return data;
        }
    };
});