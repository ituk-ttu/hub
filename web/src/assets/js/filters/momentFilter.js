app.filter('moment', [
    function () {
        return function (date, method) {
            var momented = moment(date);
            return momented[method].apply(momented, Array.prototype.slice.call(arguments, 2));
        };
    }
]);
