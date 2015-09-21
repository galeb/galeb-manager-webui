var app = angular.module('galeb-manager-webui', [
	'ngResource',
	'ui.router',
	'spring-data-rest',
	'infinite-scroll',
	'angularSpinner',
	'jcs-autoValidate',
	'angular-ladda',
	'mgcrea.ngStrap',
	'toaster',
	'ngAnimate'
]);

app.config(function ($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('dashboard', {
			url: "/",
            templateUrl: 'templates/dashboard.html',
            controller: 'DashboardController'
		})
		.state('virtualhost', {
			url: "/virtualhost",
            templateUrl: 'templates/virtualhost.html',
            controller: 'ManagerController',
            resolve: {
                apiPath: function() { return 'virtualhost' },
                apiType: function() { return '' },
                apiLinks: function() { return 'environment-project' }
            }
		})
		.state('rule', {
            url: "/rule",
            templateUrl: 'templates/rule.html',
            controller: 'ManagerController',
            resolve: {
                apiPath: function() { return 'rule' },
                apiType: function() { return '' },
                apiLinks: function() { return 'target-ruleType-parents' }
            }
        })
        .state('backendpool', {
            url: "/backendpool",
            templateUrl: 'templates/backendpool.html',
            controller: 'ManagerController',
            resolve: {
                apiPath: function() { return 'target' },
                apiType: function() { return 'BackendPool' },
                apiLinks: function() { return 'environment-project-balancePolicy' }
            }
        })
        .state('backend', {
            url: "/backend",
            templateUrl: 'templates/backend.html',
            controller: 'ManagerController',
            resolve: {
                apiPath: function() { return 'target' },
                apiType: function() { return 'Backend' },
                apiLinks: function() { return 'environment-project' }
            }
        })
        .state('project', {
            url: "/project",
            templateUrl: 'templates/project.html',
            controller: 'ManagerController',
            resolve: {
                apiPath: function() { return 'project' },
                apiType: function() { return '' },
                apiLinks: function() { return 'teams' }
            }
        })
        .state('team', {
                    url: "/team",
                    templateUrl: 'templates/team.html',
                    controller: 'ManagerController',
                    resolve: {
                        apiPath: function() { return 'team' },
                        apiType: function() { return '' },
                        apiLinks: function() { return 'accounts' }
                    }
                })

	$urlRouterProvider.otherwise('/');
});

app.config(function ($httpProvider, $resourceProvider, laddaProvider, SpringDataRestInterceptorProvider) {
	$httpProvider.defaults.headers.common['x-auth-token'] = '1971a50a-50f8-41c5-902a-97be2b3baf32';
	$resourceProvider.defaults.stripTrailingSlashes = false;
	laddaProvider.setOption({
		style: 'expand-right'
	});
	SpringDataRestInterceptorProvider.apply();
});

app.factory("ManagerFactory", function ($resource) {
    return $resource("http://localhost:8000/:path/:id", {path: '@path', id: '@id'}, {
        update: {
            method: 'PATCH'
        }
    });
});

app.factory("ManagerWithTypeFactory", function ($resource) {
    return $resource("http://localhost:8000/:path/search/findByTargetTypeName?name=:type",
        {path: '@path', type: '@type'}
    );
});

app.directive('ccSpinner', function () {
	return {
		'restrict': 'AE',
		'templateUrl': 'templates/common/spinner.html',
		'scope': {
			'isLoading': '=',
			'message': '@'
		}
	}
});

app.directive('ngReallyClick', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                var message = attrs.ngReallyMessage;
                if (message && confirm(message)) {
                    scope.$apply(attrs.ngReallyClick);
                }
            });
        }
    }
}]);

app.controller('ManagerController', function ($scope, $modal, ManagerService, $filter, apiPath, apiType, apiLinks) {

    modalName = apiType ? $filter('lowercase')(apiType) : apiPath;
    apiLinks = apiLinks ? apiLinks.split("-") : [];

	$scope.manager = ManagerService;

	$scope.manager.init(apiPath, apiType, apiLinks);
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
	        templateUrl: 'templates/modal/' + modalName + '.html',
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
        $scope.manager.selectedResource = {};

        if (resource) {
            $scope.manager.selectedResource = resource;
        }
        $scope.manager.removeResource($scope.manager.selectedResource);
    };
});

app.controller('VirtualHostController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
    $scope.manager.loadListResources('virtualhost');
});

app.controller('BackendPoolController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
    $scope.manager.loadListResources('target', 'BackendPool');
});

app.controller('AccountController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
    $scope.manager.loadListResources('account');
});

app.controller('TeamController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
    $scope.manager.loadListResources('team');
});

app.controller('ProjectController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
    $scope.manager.loadListResources('project');
});

app.controller('EnvironmentController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
    $scope.manager.loadListResources('environment');
});

app.controller('RuleTypeController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
    $scope.manager.loadListResources('ruletype');
});

app.controller('TargetTypeController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
    $scope.manager.loadListResources('targettype');
});

app.controller('BalanceTypeController', function ($scope, ManagerService) {
	$scope.manager = ManagerService;
    $scope.manager.loadListResources('balancepolicytype');
});

app.service('ManagerService', function (ManagerFactory, ManagerWithTypeFactory, $rootScope, $q, toaster) {

	var self = {
		'getResource': function (id) {
			for (var i = 0; i < self.resources.length; i++) {
				var obj = self.resources[i];
				if (obj.id == id) {
					return obj;
				}
			}
		},
		'page': 0,
		'hasMore': true,
		'isLoading': false,
		'isSaving': false,
		'selectedResource': null,
		'resources': [],
		'listResources': [],
		'search': null,
		'ordering': 'name',
		'apiPath': '',
		'apiType': '',
		'apiLinks': '',
		'init': function (path, type, links) {
		    self.apiPath = path;
            self.apiType = type;
            self.apiLinks = links;
            self.reset();
		},
		'reset': function () {
		    self.isLoading = false;
		    self.hasMore = true;
		    self.isSaving = false;
            self.page = 0;
            self.resources = [];
            self.listResources = [];
		},
		'actionReset': function () {
            self.selectedResource = null;
            self.reset();
            self.loadResources();
		},
		'loadResources': function () {
			if (self.hasMore && !self.isLoading) {
				self.isLoading = true;

				var params = {
					'path': self.apiPath,
					'type': self.apiType
				};

                customFactory = ManagerFactory;
				if (self.apiType === 'BackendPool' || self.apiType === 'Backend') {
				    customFactory = ManagerWithTypeFactory;
				}

                customFactory.get(params, function (response) {
                    angular.forEach(response._embeddedItems, function(resource) {
                        angular.forEach(self.apiLinks, function(link) {
                            resource._resources(link).get(function (subItem) {
                                if (subItem._embeddedItems) {
                                    var tmpArr = [];
                                    var tmpArrLinks = [];
                                    angular.forEach(subItem._embeddedItems, function(item) {
                                        tmpObj = {'name': item.name, 'href': item._links.self.href};
                                        tmpArr.push(tmpObj);
                                        tmpArrLinks.push(item._links.self.href);
                                    });
                                    resource[link + 'Obj'] = tmpArr;
                                    resource[link] = tmpArrLinks;
                                } else {
                                    tmpObj = {'name': subItem.name, 'href': subItem._links.self.href};
                                    resource[link + 'Obj'] = tmpObj;
                                    resource[link] = subItem._links.self.href
                                }
                            });
                        });
                        self.resources.push(resource);
                    });

                    if (response.page) {
                        if (self.page == response.page.totalPages) {
                            self.hasMore = false;
                        }
                    } else {
                        self.hasMore = false;
                    }

					self.isLoading = false;
				});
			}

		},
		'loadMore': function () {
			if (self.hasMore && !self.isLoading) {
				self.page += 1;
				self.loadResources();
			}
		},
		'loadListResources': function (apiPath, apiType) {
		    self[apiPath] = [];
            var params = {
                'path': apiPath,
                'type': apiType
            };

            customFactory = ManagerFactory;
            if (apiType === 'BackendPool' || apiType === 'Backend') {
                customFactory = ManagerWithTypeFactory;
            }

            customFactory.get(params, function (response) {
                angular.forEach(response._embeddedItems, function(data) {
                    data['selfLink'] = data._links.self.href;
                    self[apiPath].push(data);
                });
            });
        },
		'updateResource': function (resource) {
			var d = $q.defer();
			self.isSaving = true;
			ManagerFactory.update({'path': self.apiPath, 'id': resource.id}, resource).$promise.then(function () {
				self.isSaving = false;
                self.actionReset();
				toaster.pop('success', 'Updated', resource.name);
				d.resolve();
			}, function (error) {
                self.isSaving = false;
                toaster.pop('error', 'Something was wrong:', error.status + ' - ' + error.statusText);
            });
			return d.promise;
		},
		'removeResource': function (resource) {
			var d = $q.defer();
			self.isDeleting = true;
			ManagerFactory.delete({'path': self.apiPath, 'id': resource.id}, resource).$promise.then(function () {
			    self.isDeleting = false;
				var index = self.resources.indexOf(resource);
				self.resources.splice(index, 1);
				self.actionReset();
				toaster.pop('success', 'Deleted', resource.name);
				d.resolve();
			}, function (error) {
			    self.isDeleting = false;
			    self.selectedResource = null;
                toaster.pop('error', 'Something was wrong:', error.status + ' - ' + error.statusText);
			});
			return d.promise;
		},
		'createResource': function (resource) {
			var d = $q.defer();
			self.isSaving = true;
			ManagerFactory.save({'path': self.apiPath}, resource).$promise.then(function () {
				self.isSaving = false;
				self.actionReset();
				toaster.pop('success', 'Created', resource.name);
				d.resolve();
			}, function (error) {
			    self.isSaving = false;
                self.selectedResource = null;
                toaster.pop('error', 'Something was wrong:', error.status + ' - ' + error.statusText);
            });
			return d.promise;
		}

	};

	return self;

});