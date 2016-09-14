angular.module('galebWebui', [
	'ngResource',
	'ngStorage',
	'ui.router',
	'spring-data-rest',
	'infinite-scroll',
	'angularSpinner',
	'jcs-autoValidate',
	'angular-ladda',
	'mgcrea.ngStrap',
	'ngAnimate',
	'toastr',
	'oitozero.ngSweetAlert',
	'ui.sortable',
	'angular-md5',
	'ngSanitize',
	'ui.select'
]).config(function ($stateProvider, $urlRouterProvider, $httpProvider, $resourceProvider, laddaProvider,
	SpringDataRestInterceptorProvider, toastrConfig) {

		$stateProvider.state('login', {
			url: "/login",
			templateUrl: 'views/pages/login.html',
			controller: 'AuthController'
		})
		.state('logout', {
			url: "/logout",
			templateUrl: 'views/pages/logout.html',
			controller: 'LogoutController'
		})
		.state('dashboard', {
			url: "/",
			templateUrl: 'views/pages/dashboard.html'
		})
		.state('virtualhost', {
			url: "/virtualhost",
			templateUrl: 'views/pages/virtualhost.html',
			controller: 'ManagerController',
			resolve: {
				apiPath: function() { return 'virtualhost' },
				apiLinks: function() { return 'environment-project-rules-ruleDefault' },
				apiForce: function() { return {'project': 'project', 'rules': 'rules'} }
			}
		})
		.state('rule', {
			url: "/rule",
			templateUrl: 'views/pages/rule.html',
			controller: 'ManagerController',
			resolve: {
				apiPath: function() { return 'rule' },
				apiLinks: function() { return 'pool-ruleType-parents' },
				apiForce: function() { return {'pool': 'pool', 'parents': 'virtualhost'} }
			}
		})
		.state('pool', {
			url: "/pool",
			templateUrl: 'views/pages/pool.html',
			controller: 'ManagerController',
			resolve: {
				apiPath: function() { return 'pool' },
				apiLinks: function() { return 'environment-project-balancePolicy' },
				apiForce: function() { return {'project': 'project'} }
			}
		})
		.state('target', {
			url: "/target",
			templateUrl: 'views/pages/target.html',
			controller: 'ManagerController',
			resolve: {
				apiPath: function() { return 'target' },
				apiLinks: function() { return 'project-parent' },
				apiForce: function() { return {'project': 'project', 'parent': 'pool'} }
			}
		})
		.state('project', {
			url: "/project",
			templateUrl: 'views/pages/project.html',
			controller: 'ManagerController',
			resolve: {
				apiPath: function() { return 'project' },
				apiLinks: function() { return 'teams' },
				apiForce: function() { return {'teams': 'team'} }
			}
		})
		.state('team', {
			url: "/team",
			templateUrl: 'views/pages/team.html',
			controller: 'ManagerController',
			resolve: {
				apiPath: function() { return 'team' },
				apiLinks: function() { return 'accounts' },
				apiForce: function() { return '' }
			}
		})
		.state('account', {
			url: "/account",
			templateUrl: 'views/pages/account.html',
			controller: 'ManagerController',
			resolve: {
				apiPath: function() { return 'account' },
				apiLinks: function() { return 'teams' },
				apiForce: function() { return {'teams': 'team'} }
			}
		})
		.state('ruletype', {
			url: "/ruletype",
			templateUrl: 'views/pages/ruletype.html',
			controller: 'ManagerController',
			resolve: {
				apiPath: function() { return 'ruletype' },
				apiLinks: function() { return '' },
				apiForce: function() { return '' }
			}
		})
		.state('balancetype', {
			url: "/balancetype",
			templateUrl: 'views/pages/balancetype.html',
			controller: 'ManagerController',
			resolve: {
				apiPath: function() { return 'balancepolicytype' },
				apiLinks: function() { return '' },
				apiForce: function() { return '' }
			}
		})
		.state('environment', {
			url: "/environment",
			templateUrl: 'views/pages/environment.html',
			controller: 'ManagerController',
			resolve: {
				apiPath: function() { return 'environment' },
				apiLinks: function() { return '' },
				apiForce: function() { return '' }
			}
		})
		.state('balancepolicy', {
			url: "/balancepolicy",
			templateUrl: 'views/pages/balancepolicy.html',
			controller: 'ManagerController',
			resolve: {
				apiPath: function() { return 'balancepolicy' },
				apiLinks: function() { return 'balancePolicyType' },
				apiForce: function() { return '' }
			}
		})
		.state('provider', {
			url: "/provider",
			templateUrl: 'views/pages/provider.html',
			controller: 'ManagerController',
			resolve: {
				apiPath: function() { return 'provider' },
				apiLinks: function() { return '' },
				apiForce: function() { return '' }
			}
		})
		.state('farm', {
			url: "/farm",
			templateUrl: 'views/pages/farm.html',
			controller: 'ManagerController',
			resolve: {
				apiPath: function() { return 'farm' },
				apiLinks: function() { return 'provider-environment' },
				apiForce: function() { return '' }
			}
		});

		$urlRouterProvider.otherwise('/login');

		$resourceProvider.defaults.stripTrailingSlashes = false;

		$httpProvider.defaults.headers.common.Authorization = 'Basic ';
		$httpProvider.defaults.useXDomain = true;
		$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

		laddaProvider.setOption({
			style: 'expand-right'
		});

		SpringDataRestInterceptorProvider.apply();

		angular.extend(toastrConfig, {
			progressBar: true,
			timeOut: 4000,
			newestOnTop: true,
			positionClass: 'toast-bottom-right'
		});

		$httpProvider.interceptors.push('httpResponseInterceptor');
	})
	.run(function ($rootScope, $location, config, AuthService, defaultErrorMessageResolver) {
		defaultErrorMessageResolver.getErrorMessages().then(function (errorMessages) {
			errorMessages['badTarget'] = 'You must use the target pattern, with "http://" and the port. Eg: http://127.0.0.1:80';
		});

		$rootScope.statusGaleb = config.statusGaleb;
		$rootScope.statusIaaS = config.statusIaaS;
		$rootScope.dateNow = new Date();

		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
			$rootScope.currentState = toState.name;
			if (!AuthService.isLoggedIn()){
				if (toState.name !== AuthService.loginPath) {
					$location.path(AuthService.logoutPath);
				}
			} else if (toState.name === AuthService.loginPath) {
				$location.path(AuthService.homePath);
			}
		});
	});
