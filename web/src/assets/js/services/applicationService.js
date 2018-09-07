app.factory("applicationService", ["$q", "$http", function($q, $http) {

    function get (id) {
        var deferred = $q.defer();
        $http.get(apiBase + "/application/" + id)
            .then(function(data) {
                return deferred.resolve(data);
        });
        return deferred.promise;
    }

    function getAll () {
        var deferred = $q.defer();
        $http.get(apiBase + "/application")
            .then(function(data) {
                return deferred.resolve(data);
        });
        return deferred.promise;
    }

    function setStatus(id, status) {
        var deferred = $q.defer();
        $http.patch(apiBase + "/application/" + id + "/status", {status: status})
            .then(function(data) {
                return deferred.resolve(data);
        });
        return deferred.promise;
    }

    return {
        get: function (id) {
            return get(id);
        },
        getAll: function () {
            return getAll();
        },
        setStatus: function (id, status) {
            return setStatus(id, status)
        }
    }
}]);