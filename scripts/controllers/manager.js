angular.module('galebWebui')
.controller('ManagerController', function (
    $scope, $modal, ManagerService, $filter, apiPath, apiLinks, SweetAlert) {

    $scope.modalName = apiPath;
    apiType = '';

    if (apiPath.indexOf('-') !== -1) {
        var tmpSplit = apiPath.split("-");
        apiPath = tmpSplit[0];
        apiType = tmpSplit[1];
    }

    $scope.apiLinks = apiLinks ? apiLinks.split("-") : [];

	$scope.manager = ManagerService;

	$scope.manager.init(apiPath, apiType, $scope.apiLinks);
	$scope.manager.loadResources();

	$scope.loadMore = function () {
		$scope.manager.loadMore();
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
	        templateUrl: 'views/modal/' + $scope.modalName + '.html',
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
            text: "Your will not be able to recover <b>" + resource.name + "<b>!",
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
});