angular.module('galebWebui')
.directive('gwSync', function() {
    return {
        restrict: 'AE',
        templateUrl: 'views/common/sync.html',
        scope: {
            status: '@'
        },
        link: function(scope, el, attr) {
            var returnColor = ' text-success';
            var returnText = ' OK';
            angular.forEach(scope.status, function(element) {
                switch (element) {
                    case 'PENDING':
                        returnColor = ' text-warning';
                        returnText = ' PENDING';
                    case 'DELETED':
                        returnColor = ' text-info';
                        returnText = ' DELETED';
                    case 'UNKNOWN':
                        returnColor = '';
                        returnText = ' UNKNOWN';
                }
            });
            scope.syncColor = returnColor;
            scope.syncText = returnText;
        },
    }
});