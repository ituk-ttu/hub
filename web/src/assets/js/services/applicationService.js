app.factory("applicationService", ["$q", "$http", function($q, $http) {

    function get (id) {
        var deferred = $q.defer();
        $http.get(apiBase + "/application/" + id)
            .success(function(data) {
                return deferred.resolve(data);
            }).error(function() {
            //TODO: implement error handling
        });
        return deferred.promise;
    }

    function getAll () {
        var deferred = $q.defer();
        $http.get(apiBase + "/application")
            .success(function(data) {
                return deferred.resolve(data);
            }).error(function() {
            //TODO: implement error handling
        });
        return deferred.promise;
    }

    return {
        get: function(id) {
            return get(id);
        },
        getAll: function () {
            return getAll();
        }
    }
}]);