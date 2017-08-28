app.factory("mentorService", ["$q", "$http", function($q, $http) {

    function get (id) {
        var deferred = $q.defer();
        $http.get(apiBase + "/mentor/" + id)
            .then(function(data) {
                return deferred.resolve(data);
        });
        return deferred.promise;
    }

    function getByUserId (id) {
        var deferred = $q.defer();
        $http.get(apiBase + "/mentor/user/" + id)
            .then(function(data) {
                return deferred.resolve(data);
        });
        return deferred.promise;
    }

    function getAll () {
        var deferred = $q.defer();
        $http.get(apiBase + "/mentor")
            .then(function(data) {
                return deferred.resolve(data);
        });
        return deferred.promise;
    }

    function save(mentor) {
        var deferred = $q.defer();
        $http.put(apiBase + "/mentor/user/" + mentor.mentorshipId, mentor)
            .then(function(data) {
                return deferred.resolve(data);
        });
        return deferred.promise;
    }

    return {
        get: function (id) {
            return get(id);
        },
        getByUserId: function (id) {
            return getByUserId(id);
        },
        getAll: function () {
            return getAll();
        },
        save: function (user) {
            return save(user);
        }
    }
}]);