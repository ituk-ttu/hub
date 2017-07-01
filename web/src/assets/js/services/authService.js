app.factory("authService", ["", function() {

    var password = {
        success: true,
        token: "Bearer S0m3Th1n65omE7hiNG"
    };

    return {
        password: function(username, password) {
            return password;
        }
    }
}]);