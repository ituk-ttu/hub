app.factory("authService", ["$q", "$http", function($q, $http) {

    function usingPassword(username, password) {
        var deferred = $q.defer();
        $http.post(apiBase + "/authenticate/password", {username: username, password: password})
            .then(function(data) {
                return deferred.resolve(data);
        });
        return deferred.promise;
    }

    function invalidateSession() {
        var deferred = $q.defer();
        $http.post(apiBase + "/authenticate/invalidate", null)
            .then(function(data) {
                return deferred.resolve(data);
        });
        return deferred.promise;
    }

    function recover(email) {
        var deferred = $q.defer();
        $http.post(apiBase + "/recover", {email: email})
            .then(function(data) {
                return deferred.resolve(data);
        });
        return deferred.promise;
    }

    function recoverComplete(id, key, password, passwordConfirm) {
        var deferred = $q.defer();
        $http.post(apiBase + "/recover/" + id + "/" + key, {newPassword: password, newPasswordConfirm: passwordConfirm})
            .then(function(data) {
                return deferred.resolve(data);
        });
        return deferred.promise;
    }

    return {
        password: function(username, password) {
            return usingPassword(username, password);
        },
        invalidateSession: function() {
            return invalidateSession();
        },
        recover: function(email) {
            return recover(email);
        },
        recoverComplete: function(id, key, password, passwordConfirm) {
            return recoverComplete(id, key, password, passwordConfirm);
        }
    }
}]);