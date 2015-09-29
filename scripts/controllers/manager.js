angular.module('galebWebui')
.controller('ManagerController', function (
    $scope, $modal, ManagerService, $filter, apiPath, apiLinks, SweetAlert) {

    $scope.apiLinks = apiLinks ? apiLinks.split("-") : [];

	$scope.manager = ManagerService;
	$scope.manager.init(apiPath, $scope.apiLinks);
	$scope.manager.searchText = '';
	$scope.manager.loadResources();

	$scope.loadMore = function () {
		$scope.manager.loadMore();
	};

	$scope.doSearch = function () {
	    $scope.manager.doSearch();
	};

	$scope.showManagerModal = function (resource) {
	    $scope.mode = 'Create';
	    $scope.manager.selectedResource = {};

	    if (resource) {
	        $scope.manager.selectedResource = resource;
	        $scope.mode = 'Edit';
	    }

	    $scope.managerModal = $modal({
	        scope: $scope,
	        templateUrl: 'views/modal/' + apiPath + '.html',
	        show: true
	    });
	}

	$scope.saveResource = function () {
	    if ($scope.manager.selectedResource.id != null) {
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
                        closeOnConfirm: false,
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