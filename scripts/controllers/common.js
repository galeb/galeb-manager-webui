angular.module('galebWebui')
.controller('RolesController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
	$scope.manager.roles = ['ROLE_USER', 'ROLE_ADMIN'];
})
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
