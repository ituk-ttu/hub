app.factory("userService", ["$q", "$http", function($q, $http) {

    function get (id) {
        var deferred = $q.defer();
        if (id === undefined || id === null) id = "me";
        $http.get(apiBase + "/user/" + id)
            .then(function(data) {
                return deferred.resolve(data);
        });
        return deferred.promise;
    }

    function getAll () {
        var deferred = $q.defer();
        $http.get(apiBase + "/user")
            .then(function(data) {
                return deferred.resolve(data);
        });
        return deferred.promise;
    }

    function create(user) {
        var deferred = $q.defer();
        $http.post(apiBase + "/user", user)
            .then(function(data) {
                return deferred.resolve(data);
        });
        return deferred.promise;
    }

    function save(user) {
        var deferred = $q.defer();
        $http.put(apiBase + "/user/" + user.id, user)
            .then(function(data) {
                return deferred.resolve(data);
        });
        return deferred.promise;
    }

    function savePassword(password) {
        var deferred = $q.defer();
        $http.put(apiBase + "/user/me/password", password)
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
        create: function (user) {
            return create(user);
        },
        save: function (user) {
            return save(user);
        },
        savePassword: function (password) {
            return savePassword(password);
        }
    }
}]);