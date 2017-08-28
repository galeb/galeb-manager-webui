angular.module('galebWebui')
.directive('gwHealth', function(config) {
    return {
        restrict: 'AE',
        templateUrl: 'views/common/health.html',
        scope: {
            status: '@',
            message: '@',
        },
        link: function(scope, el, attr) {
            scope.healthColor = config.healthColor;
        },
    }
});