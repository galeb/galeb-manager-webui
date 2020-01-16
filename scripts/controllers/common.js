angular.module('galebWebui')
.controller('RolesController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
	$scope.manager.roles = ['ROLE_USER', 'ROLE_ADMIN'];
})
.controller('DriverController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
	$scope.manager.driver = ['GalebV32'];
})
.controller('EnvironmentController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
	$scope.manager.loadListResources('environment');
})
.controller('RuleTypeController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
	$scope.manager.loadListResources('ruletype');
})
.controller('ProviderController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
	$scope.manager.loadListResources('provider');
})
.controller('BalancePolicyController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
	$scope.manager.loadListResources('balancepolicy');
})
.controller('BalanceTypeController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
	$scope.manager.loadListResources('balancepolicytype');
});
