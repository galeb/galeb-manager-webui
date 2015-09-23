angular.module('galebWebui')
.directive('ccSpinner', function () {
	return {
		'restrict': 'AE',
		'templateUrl': 'views/common/spinner.html',
		'scope': {
			'isLoading': '=',
			'message': '@'
		}
	}
});