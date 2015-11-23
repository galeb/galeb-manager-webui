angular.module('galebWebui')
.controller('VirtualHostDashController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
    $scope.manager.loadListResources('virtualhost', true);
})
.controller('PoolDashController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
    $scope.manager.loadListResources('pool', true);
})
.controller('TargetDashController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
    $scope.manager.loadListResources('target', true);
})
.controller('AccountDashController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
    $scope.manager.loadListResources('account', true);
})
.controller('TeamDashController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
    $scope.manager.loadListResources('team', true);
})
.controller('ProjectDashController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
    $scope.manager.loadListResources('project', true);
})
.controller('RuleDashController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
    $scope.manager.loadListResources('rule', true);
})
.controller('FarmDashController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
    $scope.manager.loadListResources('farm', true);
})
;