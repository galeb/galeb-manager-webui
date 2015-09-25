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
            apiLinks: function() { return 'environment-project' }
        }
    })
    .state('rule', {
        url: "/rule",
        templateUrl: 'views/pages/rule.html',
        controller: 'ManagerController',
        resolve: {
            apiPath: function() { return 'rule' },
            apiLinks: function() { return 'pool-ruleType-parents' }
        }
    })
    .state('pool', {
        url: "/pool",
        templateUrl: 'views/pages/pool.html',
        controller: 'ManagerController',
        resolve: {
            apiPath: function() { return 'pool' },
            apiLinks: function() { return 'environment-project-balancePolicy' }
        }
    })
    .state('target', {
        url: "/target",
        templateUrl: 'views/pages/target.html',
        controller: 'ManagerController',
        resolve: {
            apiPath: function() { return 'target' },
            apiLinks: function() { return 'project-pool' }
        }
    })
    .state('project', {
        url: "/project",
        templateUrl: 'views/pages/project.html',
        controller: 'ManagerController',
        resolve: {
            apiPath: function() { return 'project' },
            apiLinks: function() { return 'teams' }
        }
    })
    .state('team', {
        url: "/team",
        templateUrl: 'views/pages/team.html',
        controller: 'ManagerController',
        resolve: {
            apiPath: function() { return 'team' },
            apiLinks: function() { return 'accounts' }
        }
    })
    .state('account', {
        url: "/account",
        templateUrl: 'views/pages/account.html',
        controller: 'ManagerController',
        resolve: {
            apiPath: function() { return 'account' },
            apiLinks: function() { return 'teams' }
        }
    })
    .state('ruletype', {
        url: "/ruletype",
        templateUrl: 'views/pages/ruletype.html',
        controller: 'ManagerController',
        resolve: {
            apiPath: function() { return 'ruletype' },
            apiLinks: function() { return '' }
        }
    })
    .state('balancetype', {
        url: "/balancetype",
        templateUrl: 'views/pages/balancetype.html',
        controller: 'ManagerController',
        resolve: {
            apiPath: function() { return 'balancepolicytype' },
            apiLinks: function() { return '' }
        }
    })
    .state('environment', {
        url: "/environment",
        templateUrl: 'views/pages/environment.html',
        controller: 'ManagerController',
        resolve: {
            apiPath: function() { return 'environment' },
            apiLinks: function() { return '' }
        }
    })
    .state('balancepolicy', {
        url: "/balancepolicy",
        templateUrl: 'views/pages/balancepolicy.html',
        controller: 'ManagerController',
        resolve: {
            apiPath: function() { return 'balancepolicy' },
            apiLinks: function() { return 'balancePolicyType' }
        }
    })
    .state('provider', {
        url: "/provider",
        templateUrl: 'views/pages/provider.html',
        controller: 'ManagerController',
        resolve: {
            apiPath: function() { return 'provider' },
            apiLinks: function() { return '' }
        }
    })
    .state('farm', {
        url: "/farm",
        templateUrl: 'views/pages/farm.html',
        controller: 'ManagerController',
        resolve: {
            apiPath: function() { return 'farm' },
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
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        $rootScope.currentState = toState.name;
        if (!AuthService.isLoggedIn()){
            $location.path(AuthService.loginPath);
        } else if (toState.name === AuthService.loginPath) {
            $location.path(AuthService.homePath);
        }
    });
});