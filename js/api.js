angular.module('api', [])
    .controller('ProjectController',function($scope, $http, halClient){
        halClient.$get('http://localhost:8000/project').then(function (resource) {
            return resource.$get('project');
        }).then(function(project) {
            $scope.projects = project;
            project.forEach(function (data) {
                data['selfLink'] = data.$href('self');
            })
        });
    })
    .controller('EnvironmentController',function($scope, $http, halClient){
        halClient.$get('http://localhost:8000/environment').then(function (resource) {
            return resource.$get('environment');
        }).then(function(environment) {
            $scope.environments = environment;
            environment.forEach(function (data) {
                data['selfLink'] = data.$href('self');
            })
        });
    })
    .controller('TargetTypeController',function($scope, $http, halClient){
        halClient.$get('http://localhost:8000/targettype').then(function (resource) {
            return resource.$get('targettype');
        }).then(function(targettype) {
            $scope.targettypes = targettype;
            targettype.forEach(function (data) {
                data['selfLink'] = data.$href('self');
            })
        });
    })
    .controller('apiModalCtrl', function ($scope, $http, $modalInstance, api, $location) {

		$scope.api = angular.copy(api);
        var apiUrl = 'http://localhost:8000' + $location.path();

		$scope.save = function () {
			if ($scope.api.id != null) {
				$http.put(apiUrl + '/' + $scope.api.id, $scope.api).then(function () {
				});
			} else {
				$http.post(apiUrl, $scope.api).then(function () {
				});
			}

			$modalInstance.close($scope.api);
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

	})
	.controller('ApiController', function($scope, $http, $modal, $location, halClient) {
		var self = this;
		$scope.api = {};
        var baseUrl = 'http://localhost:8000';
        var pathUrl = $location.path();
        var apiUrl = baseUrl + pathUrl;

		$scope.list = function () {
            $scope.apis = {};
            halClient.$get(apiUrl).then(function (resource) {
                return resource.$get(pathUrl.replace('/',''));
            }).then(function(api) {
                $scope.apis = api;
                api.forEach(function (item) {
                    angular.forEach(item.$links(), function (element, index) {
                        if (index !== 'self') {
                            if (index.slice(-1) !== 's') {
                                $http.get(element.href).success(function (data, status) {
                                    if (status !== 404) {
                                        var tmpObj = {'name': data.name, 'href': data._links.self.href};
                                        item[index + 'Obj'] = tmpObj;
                                        item[index] = data._links.self.href;
                                        tmpObj = {};
                                    }
                                });
                            }
                        }
                    });
                });
            });
		};

		$scope.remove = function (api) {
			var confirm = window.confirm('Are you sure to delete ' + api.name + '?');
			if (confirm) {
				$http.delete(apiUrl + '/' + api.id).then(function () {
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

			modalInstance.result.then(function (data) {
                $scope.list();
			});
		};

		$scope.list();

	});
