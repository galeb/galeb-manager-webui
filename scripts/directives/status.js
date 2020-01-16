angular.module('galebWebui')
.directive('gwStatus', function () {
    return {
        'restrict': 'AE',
        'templateUrl': 'views/common/status.html',
        'scope': {
            'status': '@'
        }
    }
});
