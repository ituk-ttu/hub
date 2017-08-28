app.filter('applicationOrderer', function() {

    function getPriority(item) {
        switch (item.status) {
            case "WAITING":
                return 0;
            case "ACCEPTED":
                return 1;
            case "REJECTED":
                return 2;
            default:
                return 3;
        }
    }

    return function(items) {
        items.sort(function (a, b) {
            if (getPriority(a) === getPriority(b)) {
                return b.id - a.id;
            } else {
                return getPriority(a) - getPriority(b);
            }
        });
        return items;

    };
});