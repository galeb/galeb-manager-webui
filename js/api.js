angular.module('api', [])
    .controller('VirtualHostController',function($scope, $http, halClient){
        halClient.$get(baseUrl + '/virtualhost').then(function (resource) {
            return resource.$get('virtualhost');
        }).then(function(virtualhost) {
            $scope.virtualhosts = virtualhost;
            virtualhost.forEach(function (data) {
                data['selfLink'] = data.$href('self');
            })
        });
    })
    .controller('ProjectController',function($scope, $http, halClient){
        halClient.$get(baseUrl + '/project').then(function (resource) {
            return resource.$get('project');
        }).then(function(project) {
            $scope.projects = project;
            project.forEach(function (data) {
                data['selfLink'] = data.$href('self');
            })
        });
    })
    .controller('EnvironmentController',function($scope, $http, halClient){
        halClient.$get(baseUrl + '/environment').then(function (resource) {
            return resource.$get('environment');
        }).then(function(environment) {
            $scope.environments = environment;
            environment.forEach(function (data) {
                data['selfLink'] = data.$href('self');
            })
        });
    })
    .controller('TargetTypeController',function($scope, $http, halClient){
        halClient.$get(baseUrl + '/targettype').then(function (resource) {
            return resource.$get('targettype');
        }).then(function(targettype) {
            $scope.targettypes = targettype;
            targettype.forEach(function (data) {
                data['selfLink'] = data.$href('self');
            })
        });
    })
    .controller('RuleTypeController',function($scope, $http, halClient){
        halClient.$get(baseUrl + '/ruletype').then(function (resource) {
            return resource.$get('ruletype');
        }).then(function(ruletype) {
            $scope.ruletypes = ruletype;
            ruletype.forEach(function (data) {
                data['selfLink'] = data.$href('self');
            })
        });
    })
    .controller('BalanceTypeController',function($scope, $http, halClient){
        halClient.$get(baseUrl + '/balancepolicytype').then(function (resource) {
            return resource.$get('balancepolicytype');
        }).then(function(balancepolicytype) {
            $scope.balancepolicytypes = balancepolicytype;
            balancepolicytype.forEach(function (data) {
                data['selfLink'] = data.$href('self');
            })
        });
    })
    .controller('BalancePolicyController',function($scope, $http, halClient){
        halClient.$get(baseUrl + '/balancepolicy').then(function (resource) {
            return resource.$get('balancepolicy');
        }).then(function(balancepolicy) {
            $scope.balancepolicies = balancepolicy;
            balancepolicy.forEach(function (data) {
                data['selfLink'] = data.$href('self');
            })
        });
    })
    .controller('TeamController',function($scope, $http, halClient){
        halClient.$get(baseUrl + '/team').then(function (resource) {
            return resource.$get('team');
        }).then(function(team) {
            $scope.teams = team;
            team.forEach(function (data) {
                data['selfLink'] = data.$href('self');
            })
        });
    })
    .controller('BackendPoolController',function($scope, $http, halClient){
        halClient.$get(baseUrl + '/target/search/findByTargetTypeName?name=BackendPool').then(function (resource) {
            return resource.$get('target');
        }).then(function(target) {
            $scope.backendpools = target;
            target.forEach(function (data) {
                data['selfLink'] = data.$href('self');
            })
        });
    })
    .controller('RoleController',function($scope, $http, halClient){
        $scope.roles = ['ROLE_USER', 'ROLE_ADMIN'];
    })
    .controller('apiModalCtrl', function ($scope, $http, $modalInstance, api, $location) {

		$scope.api = angular.copy(api);
        var apiURL = baseUrl + '/' + angular.element(document.querySelector('#apiPath'))[0]['value'];

		$scope.save = function () {
			if ($scope.api.id != null) {
				$http.patch(apiURL + '/' + $scope.api.id, $scope.api).then(function () {
				});
			} else {
				$http.post(apiURL, $scope.api).then(function(response) {
                });
			}

			$modalInstance.close($scope.api);
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

	})
	.controller('ApiController', function($scope, $http, $modal, $location, $q, halClient) {
		var self = this;
		$scope.api = {};

        $scope.extractInfo = function () {
            $scope.apiPath = angular.element(document.querySelector('#apiPath'))[0]['value'];
            $scope.apiType = angular.element(document.querySelector('#apiType'))[0]['value'];
            $scope.apiExcludeLinks = angular.element(document.querySelector('#apiExcludeLinks'))[0]['value'].split("-");
        };

		$scope.list = function () {
            $scope.apis = {};
            $scope.extractInfo();
            var basePath = $scope.apiPath;
            var type = $scope.apiType;
            var apiURL = baseUrl + '/' + basePath;

            if (type === 'BackendPool' || type === 'Backend') {
                apiURL = apiURL + '/search/findByTargetTypeName?name=' + type;
            }
            halClient.$get(apiURL).then(function (resource) {
                return resource.$has(basePath) ? resource.$get(basePath) : $q.reject(basePath + ' not found');
            }).then(function(api) {
                $scope.apis = api;
                api.forEach(function (item) {
                    angular.forEach(item.$links(), function (element, index) {
                        if ($scope.apiExcludeLinks.indexOf(index) === -1) {
                            $http.get(element.href).success(function (data) {
                                if (data._embedded) {
                                    var tmpArr = [];
                                    var tmpArrLinks = [];
                                    angular.forEach(data._embedded[index.substr(0, index.length-1)], function(embd) {
                                        tmpObj = {'name': embd.name, 'href': embd._links.self.href};
                                        tmpArr.push(tmpObj);
                                        tmpArrLinks.push(embd._links.self.href);
                                    });
                                    item[index + 'Obj'] = tmpArr;
                                    item[index] = tmpArrLinks;
                                } else {
                                    tmpObj = {'name': data.name, 'href': data._links.self.href};
                                    item[index + 'Obj'] = tmpObj;
                                    item[index] = data._links.self.href;
                                    tmpObj = {};
                                }
                            });
                        }
                    });
                });
            });
		};

		$scope.remove = function (api) {
            $scope.extractInfo();
            var apiURL = baseUrl + '/' + $scope.apiPath;
			var confirm = window.confirm('Are you sure to delete ' + api.name + '?');
			if (confirm) {
				$http.delete(apiURL + '/' + api.id).then(function () {
					$scope.list();
				});
			}
		};

		$scope.apiModal = function (api) {
			$scope.api = {};

            if (api !== null){
				$scope.api = api;
			}

		    var modalInstance = $modal.open({
		      animation: true,
		      templateUrl: 'apiModalForm.html',
		      controller: 'apiModalCtrl',
              size: 'lg',
		      resolve: {
		          api: function () {
		            return $scope.api;
		          }
		        }
		    });

            modalInstance.result.then(function (result) {
                $scope.api = {};
                $scope.list();
            });

		};

		$scope.list();

	});
