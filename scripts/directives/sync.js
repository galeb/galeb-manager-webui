angular.module('galebWebui')
.directive('gwSync', function(config) {
    return {
        restrict: 'AE',
        templateUrl: 'views/common/sync.html',
        scope: {
            status: '@'
        },
        link: function(scope, el, attr) {
            scope.syncColor = config.syncColor;
        },
    }
});