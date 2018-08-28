angular.module('galebWebui')
.controller('ManagerController', function (
  $scope, $modal, ManagerService, $filter, apiPath, apiLinks, apiForce, SweetAlert, config, toastr) {

    $scope.regex_pool_allow = "(\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(\\/[\\d]{1,2}){0,1}){1}([\\,]\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(\\/[\\d]{1,2}){0,1}){0,}";

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

    $scope.cleanVirtualHostGroup = function () {
        $scope.manager.selectedResource.virtualhostgroup = "";
    };

    $scope.showRuleOrderedModal = function (virtualhostgroup, envID, envName) {
        $scope.manager.selectedResource = {};

        if (virtualhostgroup && envID && envName) {
            var returnLoadRO = $scope.manager.loadRuleOredered(virtualhostgroup, envID, envName);
            returnLoadRO.then(function (arrayRules) {
                tmpRules = $filter('orderBy')(arrayRules, 'order');
                $scope.manager.selectedResource.arrayRuleOrder = tmpRules;
            });

            $scope.sortableOptions = {
                placeholder: "placeholder",
                stop: function() {
                    angular.forEach($scope.manager.selectedResource.arrayRuleOrder, function(value, index) {
                        value.order = index + 1;
                    });
                }
            };
        }

        $scope.ruleOrderedModal = $modal({
            scope: $scope,
            templateUrl: 'views/modal/ruleordered.html',
            show: true
        });
    };

    $scope.addRuleOrdered = function () {
        var returnRule = $scope.manager.loadRuleInformation($scope.manager.orderForm.rule);

        returnRule.then(function (ruleInfo) {
           return $scope.manager.loadEnvironmentInformation($scope.manager.selectedResource.environment_id, ruleInfo);
        }).then(function (envInfo) {
            var currentOrder = Math.max.apply(Math, $scope.manager.selectedResource.arrayRuleOrder.map(function (item) {
                return item.order;
            }));
            envInfo['order'] = currentOrder + 1;
            var ruleExist = $scope.manager.selectedResource.arrayRuleOrder.filter(item => item.ruleInfo.id === envInfo.ruleInfo.id);
            if (ruleExist.length == 0) {
                $scope.manager.selectedResource.arrayRuleOrder.push(envInfo);
            } else {
                toastr.error("Rule already exist in order list", "Error");
            }
            $scope.manager.orderForm = {};

        });
    };

    $scope.removeRuleOrdered = function (index) {
        var itemToRemove = $scope.manager.selectedResource.arrayRuleOrder.splice(index, 1);
        if (itemToRemove[0].id) {
            $scope.manager.selectedResource.arrayRuleRemove.push(itemToRemove[0]);
        }
    };

    $scope.saveRuleOrdered = function () {
        angular.forEach($scope.manager.selectedResource.arrayRuleOrder, function(value) {
            value.virtualhostgroup = $scope.manager.selectedResource.virtualhostgroup;
            if (value.id) {
                $scope.manager.updateRuleOrder(value);
            } else {
                $scope.manager.createRuleOrder(value);
            }
        });

        angular.forEach($scope.manager.selectedResource.arrayRuleRemove, function(value) {
            value.virtualhostgroup = $scope.manager.selectedResource.virtualhostgroup;
            $scope.manager.removeRuleOrder(value);
        });

        $scope.ruleOrderedModal.hide();
    }

});
