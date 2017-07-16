app.factory("userService", ["$q", "$http", function($q, $http) {

    function get (id) {
        var deferred = $q.defer();
        if (id === undefined || id === null) id = "me";
        $http.get(apiBase + "/user/" + id)
            .success(function(data) {
                return deferred.resolve(data);
            }).error(function() {
            //TODO: implement error handling
        });
        return deferred.promise;
    }

    function getAll () {
        var deferred = $q.defer();
        $http.get(apiBase + "/user")
            .success(function(data) {
                return deferred.resolve(data);
            }).error(function() {
            //TODO: implement error handling
        });
        return deferred.promise;
    }

    function create(user) {
        var deferred = $q.defer();
        $http.post(apiBase + "/user", user)
            .success(function(data) {
                return deferred.resolve(data);
            }).error(function() {
            //TODO: implement error handling
        });
        return deferred.promise;
    }

    function save(user) {
        var deferred = $q.defer();
        $http.put(apiBase + "/user/" + user.id, user)
            .success(function(data) {
                return deferred.resolve(data);
            }).error(function() {
            //TODO: implement error handling
        });
        return deferred.promise;
    }

    function destroy(id) {
        var deferred = $q.defer();
        $http.delete(apiBase + "/user/" + id)
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
        create: function (user) {
            return create(user);
        },
        save: function (user) {
            return save(user);
        },
        delete: function (user) {
            return destroy(user.id);
        }
    }
}]);