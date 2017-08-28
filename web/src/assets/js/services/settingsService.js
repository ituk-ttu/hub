app.factory("settingsService", ["$q", "$http", function($q, $http) {

    function getAllSessions() {
        var deferred = $q.defer();
        $http.get(apiBase + "/authenticate/sessions")
            .then(function(data) {
                return deferred.resolve(data);
        });
        return deferred.promise;
    }

    function invalidateSession(id) {
        var deferred = $q.defer();
        $http.post(apiBase + "/authenticate/invalidate", {id: id})
            .then(function(data) {
                return deferred.resolve(data);
        });
        return deferred.promise;
    }


    return {
        getAllSessions: function () {
            return getAllSessions();
        },
        invalidateSession: function (id) {
            return invalidateSession(id);
        }
    }
}]);