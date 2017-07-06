app.factory("resourceService", ["$q", "$http", function($q, $http) {

    function get (id) {
        var deferred = $q.defer();
        $http.get(apiBase + "/resource/" + id)
            .success(function(data) {
                return deferred.resolve(data);
            }).error(function() {
            //TODO: implement error handling
        });
        return deferred.promise;
    }

    function getAll () {
        var deferred = $q.defer();
        $http.get(apiBase + "/resource")
            .success(function(data) {
                return deferred.resolve(data);
            }).error(function() {
            //TODO: implement error handling
        });
        return deferred.promise;
    }

    function create(resource) {
        var deferred = $q.defer();
        $http.post(apiBase + "/resource", resource)
            .success(function(data) {
                return deferred.resolve(data);
            }).error(function() {
            //TODO: implement error handling
        });
        return deferred.promise;
    }

    function save(resource) {
        var deferred = $q.defer();
        $http.put(apiBase + "/resource/" + resource.id, resource)
            .success(function(data) {
                return deferred.resolve(data);
            }).error(function() {
            //TODO: implement error handling
        });
        return deferred.promise;
    }

    function destroy(id) {
        var deferred = $q.defer();
        $http.delete(apiBase + "/resource/" + id)
            .success(function(data) {
                return deferred.resolve(data);
            }).error(function() {
            //TODO: implement error handling
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
        create: function (resource) {
            return create(resource);
        },
        save: function (resource) {
            return save(resource);
        },
        delete: function (resource) {
            return destroy(resource.id);
        }
    }
}]);