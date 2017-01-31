angular.module('galebWebui')
.directive('gwStatus', function(config) {
    return {
        restrict: 'AE',
        templateUrl: 'views/common/status.html',
        scope: {
            status: '@'
        },
        link: function(scope, el, attr) {
            scope.statusColor = config.statusColor;
        },
    }
});