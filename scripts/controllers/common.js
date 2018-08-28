angular.module('galebWebui')
.controller('MethodsController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
	$scope.manager.methods = ['GET', 'POST', 'OPTIONS', 'PUT', 'HEAD', 'DELETE', 'CONNECT', 'TRACE', 'PATCH'];
})
.controller('EnvironmentController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
	$scope.manager.loadListResources('environment');
})
.controller('BalancePolicyController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
	$scope.manager.loadListResources('balancepolicy');
});
