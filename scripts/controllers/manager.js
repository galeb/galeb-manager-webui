angular.module('galebWebui')
.controller('ManagerController', function (
  $scope, $modal, ManagerService, $filter, apiPath, apiLinks, apiForce, SweetAlert, config, md5) {

    $scope.regex_virtualhost_allows = "(\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(\\/[\\d]{1,2}){0,1}){1}([\\,]\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(\\/[\\d]{1,2}){0,1}){0,}";

    $scope.apiLinks = apiLinks ? apiLinks.split("-") : [];

    $scope.manager = ManagerService;
    $scope.manager.init(apiPath, $scope.apiLinks);
    $scope.manager.searchText = '';
    $scope.manager.loadResources();

    $scope.manager.statsUrl = config.statsUrl;
    $scope.manager.logUrl = config.logUrl;

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

      $scope.manager.selectedResource.hcTCP = true;

      if (resource) {
        $scope.manager.selectedResource = resource;
        $scope.mode = 'Edit';

        $scope.manager.selectedResource.hcTCP = !angular.isDefined($scope.manager.selectedResource.properties.hcPath) &&
                                                !angular.isDefined($scope.manager.selectedResource.properties.hcStatusCode) &&
                                                !angular.isDefined($scope.manager.selectedResource.properties.hcHost) &&
                                                !angular.isDefined($scope.manager.selectedResource.properties.hcBody);

        if ($scope.manager.selectedResource.rulesOrdered) {
          $scope.sortableOptions = {
            placeholder: "placeholder"
          };
          var tmpArray = [];
          $scope.manager.selectedResource.arrayRuleOrder = [];

          angular.forEach($scope.manager.selectedResource.rulesObj, function(element, i) {

            $scope.manager.selectedResource.rulesOrdered.some(function(item) {
              if (item.ruleId == element.id) {
                element.ruleOrder = item.ruleOrder;
                return true;
              } else {
                element.ruleOrder = 999999;
              }
            });
            tmpArray.push(element);
          });

          $scope.manager.selectedResource.arrayRuleOrder = $filter('orderBy')(tmpArray, 'ruleOrder');
        }

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
        if ($scope.manager.apiPath === 'pool') {
          if ($scope.manager.selectedResource.hcTCP) {
            delete $scope.manager.selectedResource.properties.hcPath;
            delete $scope.manager.selectedResource.properties.hcStatusCode;
            delete $scope.manager.selectedResource.properties.hcHost;
            delete $scope.manager.selectedResource.properties.hcBody;
          }
        }
        if ($scope.manager.apiPath === 'virtualhost') {
          if (!$scope.manager.selectedResource.properties.allows || $scope.manager.selectedResource.properties.allows == "") {
            delete $scope.manager.selectedResource.properties.allows;
          }
        }
        if ($scope.manager.apiPath === 'balancepolicy') {
          if (!$scope.manager.selectedResource.properties.keyType || $scope.manager.selectedResource.properties.keyType == "") {
            delete $scope.manager.selectedResource.properties.keyType;
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

    $scope.cleanRuleDefault = function () {
      $scope.manager.selectedResource.ruleDefault = "";
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

    $scope.unlockFarm = function (resource) {
      SweetAlert.swal({
        title: "Are you sure?",
        text: "This will unlock <b>" + resource.name + "</b> and will perform a sync!",
        showCancelButton: true,
        confirmButtonColor: "#e51c23",
        confirmButtonText: "Yes, unlock it!",
        closeOnConfirm: false,
        html: true
      }, function(isConfirm) {
        if (isConfirm) {
          SweetAlert.swal({
            title: "Are you really sure?",
            text: "This is your last chance!",
            showCancelButton: true,
            confirmButtonColor: "#e51c23",
            confirmButtonText: "Unlock now!",
            closeOnConfirm: true,
            html: true
          }, function(isConfirmToo) {
            if (isConfirmToo) {
              $scope.manager.selectedResource = {};

              if (resource) {
                $scope.manager.selectedResource = resource;
              }
              $scope.manager.unlockFarm($scope.manager.selectedResource);
            }
          });
        }
      });
    };

  });
