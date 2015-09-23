angular.module('galebWebui')
.controller('VirtualHostController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
    $scope.manager.loadListResources('virtualhost');
})
.controller('RolesController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
    $scope.manager.roles = ['ROLE_USER', 'ROLE_ADMIN'];
})
.controller('DriverController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
    $scope.manager.driver = ['GalebV3'];
})
.controller('BackendPoolController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
    $scope.manager.loadListResources('target', 'BackendPool');
})
.controller('AccountController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
    $scope.manager.loadListResources('account');
})
.controller('TeamController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
    $scope.manager.loadListResources('team');
})
.controller('ProjectController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
    $scope.manager.loadListResources('project');
})
.controller('EnvironmentController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
    $scope.manager.loadListResources('environment');
})
.controller('RuleTypeController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
    $scope.manager.loadListResources('ruletype');
})
.controller('TargetTypeController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
    $scope.manager.loadListResources('targettype');
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