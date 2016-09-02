angular.module('galebWebui')
.controller('VirtualHostDashController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
	$scope.manager.loadResourcesDashboard('virtualhost');
})
.controller('PoolDashController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
	$scope.manager.loadResourcesDashboard('pool');
})
.controller('TargetDashController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
	$scope.manager.loadResourcesDashboard('target');
})
.controller('AccountDashController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
	$scope.manager.loadResourcesDashboard('account');
})
.controller('TeamDashController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
	$scope.manager.loadResourcesDashboard('team');
})
.controller('ProjectDashController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
	$scope.manager.loadResourcesDashboard('project');
})
.controller('RuleDashController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
	$scope.manager.loadResourcesDashboard('rule');
})
.controller('FarmDashController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
	$scope.manager.loadResourcesDashboard('farm');
});
