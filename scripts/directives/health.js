angular.module('galebWebui')
.directive('gwHealth', function(config) {
    return {
        restrict: 'AE',
        templateUrl: 'views/common/health.html',
        scope: {
            status: '@'
        },
        link: function(scope, el, attr) {
            scope.healthColor = config.statusColor;
        },
    }
});