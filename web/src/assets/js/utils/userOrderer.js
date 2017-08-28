app.filter('userOrderer', function() {

    return function(items) {
        items.sort(function (a, b) {
            if (a.archived === b.archived) {
                return 0;
            } else if (a.archived) {
                return 1;
            } else {
                return -1;
            }
        });
        return items;

    };
});