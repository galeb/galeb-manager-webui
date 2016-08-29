angular.module('galebWebui')
.controller('ManagerController', function (
    $scope, $modal, ManagerService, $filter, apiPath, apiLinks, SweetAlert, config, md5) {

    $scope.apiLinks = apiLinks ? apiLinks.split("-") : [];

	$scope.manager = ManagerService;
	$scope.manager.init(apiPath, $scope.apiLinks);
	$scope.manager.searchText = '';
	$scope.manager.loadResources();

	$scope.manager.statsUrl = config.statsUrl;

	$scope.loadMore = function () {
		$scope.manager.loadMore();
	};

	$scope.doSearch = function () {
	    $scope.manager.doSearch();
	};

	$scope.doSort = function (sortType) {
        $scope.manager.doSort(sortType);
    };

	$scope.showManagerModal = function (resource) {
	    $scope.mode = 'Create';
	    $scope.manager.selectedResource = {};

	    if (resource) {
	        $scope.manager.selectedResource = resource;
	        $scope.mode = 'Edit';

            if ($scope.manager.selectedResource.rulesOrdered) {
                $scope.sortableOptions = {
                    placeholder: "placeholder"
                };

                $scope.manager.selectedResource.arrayRuleOrder = [];
                angular.forEach($filter('orderBy')($scope.manager.selectedResource.rulesOrdered, 'ruleOrder'),
                    function(element, index) {
                    angular.forEach($scope.manager.selectedResource.rulesObj, function (v, k) {
                        if (element.ruleId == v.id) {
                            $scope.manager.selectedResource.arrayRuleOrder.push(v);
                        }
                    });
                });
            }
	    }

	    $scope.managerModal = $modal({
	        scope: $scope,
	        templateUrl: 'views/modal/' + apiPath + '.html',
	        show: true
	    });
	}

	$scope.saveResource = function () {
        if ($scope.manager.apiPath === 'account') {
            var passMD5 = md5.createHash($scope.manager.selectedResource.email + new Date() || '');
            $scope.manager.selectedResource.password = passMD5;
        }
	    if ($scope.manager.selectedResource.id != null) {
            if ($scope.manager.selectedResource.rulesOrdered) {
                $scope.manager.selectedResource.rulesOrdered = [];
                angular.forEach($scope.manager.selectedResource.arrayRuleOrder, function (v, k) {
                    $scope.manager.selectedResource.rulesOrdered.push({'ruleId': v.id, 'ruleOrder': k});
                });
                if ($scope.manager.selectedResource.ruleDefault == "") {
                    $scope.manager.selectedResource.ruleDefault = null;
                }
            }
            $scope.manager.updateResource($scope.manager.selectedResource).then(function () {
                $scope.managerModal.hide();
            });
        } else {
            $scope.manager.createResource($scope.manager.selectedResource).then(function () {
                $scope.managerModal.hide();
            });
        }
    };

    $scope.removeResource = function (resource) {
        SweetAlert.swal({
            title: "Are you sure?",
            text: "You will not be able to recover <b>" + resource.name + "</b>!",
            showCancelButton: true,
            confirmButtonColor: "#e51c23",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: true,
            html: true
        }, function(isConfirm) {
            if (isConfirm) {
                $scope.manager.selectedResource = {};

                if (resource) {
                    $scope.manager.selectedResource = resource;
                }
                $scope.manager.removeResource($scope.manager.selectedResource);
            }
        });
    };

    $scope.reloadFarm = function (resource) {
        SweetAlert.swal({
            title: "Are you sure?",
            text: "This will remove all content of <b>" + resource.name + "</b><br> and will perform a reload!",
            showCancelButton: true,
            confirmButtonColor: "#e51c23",
            confirmButtonText: "Yes, reload it!",
            closeOnConfirm: false,
            html: true
        }, function(isConfirm) {
            if (isConfirm) {
                SweetAlert.swal({
                    title: "Are you really sure?",
                    text: "This is your last chance!",
                    showCancelButton: true,
                    confirmButtonColor: "#e51c23",
                    confirmButtonText: "Reload now!",
                    closeOnConfirm: true,
                    html: true
                }, function(isConfirmToo) {
                    if (isConfirmToo) {
                        $scope.manager.selectedResource = {};

                        if (resource) {
                            $scope.manager.selectedResource = resource;
                        }
                        $scope.manager.reloadFarm($scope.manager.selectedResource);
                    }
                });
            }
        });
    };

});