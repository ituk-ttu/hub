app.factory("authService", ["$q", "$http", function($q, $http) {

    function usingPassword(username, password) {
        var deferred = $q.defer();
        $http.post(apiBase + "/authenticate/password", {username: username, password: password})
            .success(function(data) {
                return deferred.resolve(data);
            }).error(function() {
            //TODO: implement error handling
        });
        return deferred.promise;
    }

    function invalidateSession() {
        var deferred = $q.defer();
        $http.post(apiBase + "/authenticate/password", null)
            .success(function(data) {
                return deferred.resolve(data);
            }).error(function() {
            //TODO: implement error handling
        });
        return deferred.promise;
    }

    return {
        password: function(username, password) {
            return usingPassword(username, password);
        },
        invalidateSession: function() {
            return invalidateSession();
        }
    }
}]);