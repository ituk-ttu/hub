app.factory('tokenInterceptor', function ($q, jwtHelper, store, $injector, $rootScope) {
    return {
        response: function (data) {
            var http = $injector.get('$http');
            if (jwtHelper.getTokenExpirationDate(store.get('jwt')) - new Date() < 60*60*24*1000 && //24h
                data.config.url.indexOf(apiBase + "/authorization") !== 0) {
                if ($rootScope.refreshingToken) {
                    return data;
                } else {
                    $rootScope.refreshingToken = true;
                    var req = {
                        method: 'POST',
                        url: apiBase + "/authorization/refresh",
                        headers: {
                         'Authorization': 'Bearer ' + store.get('jwt')
                         }
                    };
                    http(req).success(function (response) {
                        store.set('jwt', response.token);
                        console.log('Token updated, retrying');
                        $rootScope.refreshingToken = false;
                    }).error(function (response) {
                        $rootScope.refreshingToken = false;
                        console.log('Bye!');
                        state.go('auth')
                    });
                    return data;
                }
            } else if (data.status === 403) {
                console.log('Bye!');
                state.go('auth');
            } else if (data.status === 404) {
                console.log('This is fine :)');
                return $q.reject(data);
            } else {
                return data;
            }
        },
        request: function(data) {
            store.set('jwt', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkpvaGFubmVzIEvDvG1tZWwiLCJlbWFpbCI6Impva3VtbUB0dHUuZWUiLCJ0ZWxlZ3JhbSI6ImpreW1tZWwiLCJhZG1pbiI6dHJ1ZSwiYXJjaGl2ZWQiOmZhbHNlLCJjcmVhdGVkQXQiOiIyMDE3LTA3LTAxVDExOjMxOjA3LjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDE3LTA3LTAxVDExOjMxOjA3LjAwMFoiLCJpYXQiOjE0OTg5MjM0NzUsImV4cCI6MTQ5OTA5NjI3NX0.IUSQJig_GZHyCoizAH2dMWqldI7koisjyKo_Zt3mhY8");
            if (data === undefined || data.headers === undefined || data.headers.Authorization === undefined) {
                data.headers.Authorization = "Bearer " + store.get('jwt');
            }
            return data;
        }
    };
});