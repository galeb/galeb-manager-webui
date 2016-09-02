angular.module('galebWebui')
.directive('gwSpinner', function () {
	return {
		'restrict': 'AE',
		'templateUrl': 'views/common/spinner.html',
		'scope': {
			'isLoading': '=',
			'message': '@'
		}
	}
});
