angular.module('home', []).controller('home', function($scope, $http) {
	$http.get('http://localhost:8000/account/1').success(function(data) {
		$scope.user = data.name;
	});
});
