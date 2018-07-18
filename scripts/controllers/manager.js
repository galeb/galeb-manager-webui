angular.module('galebWebui')
.controller('ManagerController', function (
  $scope, $modal, ManagerService, $filter, apiPath, apiLinks, apiForce, SweetAlert, config) {

    $scope.regex_virtualhost_allows = "(\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(\\/[\\d]{1,2}){0,1}){1}([\\,]\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(\\/[\\d]{1,2}){0,1}){0,}";

    $scope.apiLinks = apiLinks ? apiLinks.split("-") : [];

    $scope.manager = ManagerService;
    $scope.manager.init(apiPath, $scope.apiLinks);
    $scope.manager.searchText = '';
    $scope.manager.loadResources();

    $scope.manager.statsVirtualhostUrl = config.statsVirtualhostUrl;
    $scope.manager.statsFarmUrl = config.statsFarmUrl;
    $scope.manager.logUrlProdBE = config.logUrlProdBE;
    $scope.manager.logUrlProdFE = config.logUrlProdFE;
    $scope.manager.logUrlDev = config.logUrlDev;
    $scope.manager.statsUrlEnv = config.statsUrlEnv;

    $scope.loadMore = function () {
      $scope.manager.loadMore();
    };

    $scope.doSearch = function () {
      $scope.manager.doSearch();
    };

    $scope.doSort = function (sortType) {
      $scope.manager.doSort(sortType);
    };

    $scope.checkStatus = function (statusMap) {
        var returnColor = 'text-success';
        angular.forEach(statusMap, function(element) {
            if (element == 'PENDING') {
                returnColor = 'text-warning';
            } else if (element == 'DELETED') {
                returnColor = '';
            }
        });
        return returnColor;
    };

    $scope.checkStatusEnv = function (statusMap) {
        var returnColor = 'text-success';
        if (statusMap[0] == 'PENDING') {
            returnColor = 'text-warning';
        } else if (statusMap[0] == 'DELETED') {
            returnColor = '';
        }
        return returnColor;
    };

    $scope.showManagerModal = function (resource) {
      $scope.mode = 'Create';
      $scope.manager.selectedResource = {};

      if (resource) {
        $scope.manager.selectedResource = resource;
        $scope.mode = 'Edit';

        angular.forEach(apiForce, function (value, key) {
          tmpObj = $scope.manager.selectedResource[key + 'Obj'];
          $scope.manager[value] = [];
          if (tmpObj instanceof Array) {
            Array.prototype.push.apply($scope.manager[value], $scope.manager.selectedResource[key + 'Obj']);
          } else {
              $scope.manager[value][0] = tmpObj;
          }
        });
      }

      $scope.managerModal = $modal({
        scope: $scope,
        templateUrl: 'views/modal/' + apiPath + '.html',
        show: true
      });
    };

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

  $scope.showReportModal = function (virtualhost) {
    $scope.manager.selectedResource = {};

    if (virtualhost) {
      $scope.manager.loadReport(virtualhost);
    }

    $scope.reportModal = $modal({
      scope: $scope,
      templateUrl: 'views/modal/report.html',
      show: true
    });
  };

});
