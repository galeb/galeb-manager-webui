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
	'oitozero.ngSweetAlert'
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
            apiType: function() { return '' },
            apiLinks: function() { return 'environment-project' }
        }
    })
    .state('rule', {
        url: "/rule",
        templateUrl: 'views/pages/rule.html',
        controller: 'ManagerController',
        resolve: {
            apiPath: function() { return 'rule' },
            apiType: function() { return '' },
            apiLinks: function() { return 'target-ruleType-parents' }
        }
    })
    .state('backendpool', {
        url: "/backendpool",
        templateUrl: 'views/pages/backendpool.html',
        controller: 'ManagerController',
        resolve: {
            apiPath: function() { return 'target' },
            apiType: function() { return 'BackendPool' },
            apiLinks: function() { return 'environment-project-balancePolicy' }
        }
    })
    .state('backend', {
        url: "/backend",
        templateUrl: 'views/pages/backend.html',
        controller: 'ManagerController',
        resolve: {
            apiPath: function() { return 'target' },
            apiType: function() { return 'Backend' },
            apiLinks: function() { return 'environment-project' }
        }
    })
    .state('project', {
        url: "/project",
        templateUrl: 'views/pages/project.html',
        controller: 'ManagerController',
        resolve: {
            apiPath: function() { return 'project' },
            apiType: function() { return '' },
            apiLinks: function() { return 'teams' }
        }
    })
    .state('team', {
        url: "/team",
        templateUrl: 'views/pages/team.html',
        controller: 'ManagerController',
        resolve: {
            apiPath: function() { return 'team' },
            apiType: function() { return '' },
            apiLinks: function() { return 'accounts' }
        }
    })
    .state('account', {
        url: "/account",
        templateUrl: 'views/pages/account.html',
        controller: 'ManagerController',
        resolve: {
            apiPath: function() { return 'account' },
            apiType: function() { return '' },
            apiLinks: function() { return 'teams' }
        }
    })
    .state('targettype', {
        url: "/targettype",
        templateUrl: 'views/pages/targettype.html',
        controller: 'ManagerController',
        resolve: {
            apiPath: function() { return 'targettype' },
            apiType: function() { return '' },
            apiLinks: function() { return '' }
        }
    })
    .state('ruletype', {
        url: "/ruletype",
        templateUrl: 'views/pages/ruletype.html',
        controller: 'ManagerController',
        resolve: {
            apiPath: function() { return 'ruletype' },
            apiType: function() { return '' },
            apiLinks: function() { return '' }
        }
    })
    .state('balancetype', {
        url: "/balancetype",
        templateUrl: 'views/pages/balancetype.html',
        controller: 'ManagerController',
        resolve: {
            apiPath: function() { return 'balancepolicytype' },
            apiType: function() { return '' },
            apiLinks: function() { return '' }
        }
    })
    .state('environment', {
        url: "/environment",
        templateUrl: 'views/pages/environment.html',
        controller: 'ManagerController',
        resolve: {
            apiPath: function() { return 'environment' },
            apiType: function() { return '' },
            apiLinks: function() { return '' }
        }
    })
    .state('balancepolicy', {
        url: "/balancepolicy",
        templateUrl: 'views/pages/balancepolicy.html',
        controller: 'ManagerController',
        resolve: {
            apiPath: function() { return 'balancepolicy' },
            apiType: function() { return '' },
            apiLinks: function() { return 'balancePolicyType' }
        }
    })
    .state('provider', {
        url: "/provider",
        templateUrl: 'views/pages/provider.html',
        controller: 'ManagerController',
        resolve: {
            apiPath: function() { return 'provider' },
            apiType: function() { return '' },
            apiLinks: function() { return '' }
        }
    })
    .state('farm', {
        url: "/farm",
        templateUrl: 'views/pages/farm.html',
        controller: 'ManagerController',
        resolve: {
            apiPath: function() { return 'farm' },
            apiType: function() { return '' },
            apiLinks: function() { return 'provider-environment' }
        }
    });

	$urlRouterProvider.otherwise('/login');

	$resourceProvider.defaults.stripTrailingSlashes = false;

    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.headers.common.Authorization = 'Basic ';

    laddaProvider.setOption({
        style: 'expand-right'
    });

    SpringDataRestInterceptorProvider.apply();

    angular.extend(toastrConfig, {
        progressBar: true,
        timeOut: 2000,
        newestOnTop: true,
        positionClass: 'toast-bottom-right',
        preventDuplicates: true
    });

    $httpProvider.interceptors.push('httpResponseInterceptor');
})
.run(function ($rootScope, $location, AuthService) {
    $rootScope.$on("$stateChangeStart", function(toState){
        if (!AuthService.isLoggedIn()){
            $location.path(AuthService.loginPath);
        } else if (toState.name === AuthService.loginPath) {
            $location.path(AuthService.homePath);
        }
    });
});