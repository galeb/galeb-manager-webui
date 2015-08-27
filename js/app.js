var baseUrl = 'http://localhost:8000';

angular
		.module('galeb-webui', [ 'ngRoute', 'ui.bootstrap', 'angular-hal', 'auth', 'home', 'api', 'navigation' ])
		.config(

				function($routeProvider, $httpProvider, $locationProvider) {

					$locationProvider.html5Mode(true);

					$routeProvider.when('/', {
						templateUrl : 'home.html'
					}).when('/environment', {
						templateUrl : 'templates/environment.html',
						controller : 'ApiController'
					}).when('/targettype', {
						templateUrl : 'templates/targettype.html',
						controller : 'ApiController'
					}).when('/ruletype', {
						templateUrl : 'templates/ruletype.html',
						controller : 'ApiController'
					}).when('/balancetype', {
						templateUrl : 'templates/balancetype.html',
						controller : 'ApiController'
					}).when('/balancepolicy', {
						templateUrl : 'templates/balancepolicy.html',
						controller : 'ApiController'
					}).when('/virtualhost', {
						templateUrl : 'templates/virtualhost.html',
						controller : 'ApiController'
					}).when('/rule', {
						templateUrl : 'templates/rule.html',
						controller : 'ApiController'
					}).when('/backendpool', {
						templateUrl : 'templates/backendpool.html',
						controller : 'ApiController'
					}).when('/backend', {
						templateUrl : 'templates/backend.html',
						controller : 'ApiController'
					}).when('/project', {
						templateUrl : 'templates/project.html',
						controller : 'ApiController'
					}).when('/team', {
						templateUrl : 'templates/team.html',
						controller : 'ApiController'
					}).when('/account', {
						templateUrl : 'templates/account.html',
						controller : 'ApiController'
					}).when('/login', {
						templateUrl : 'login.html',
						controller : 'navigation'
					}).otherwise('/');

					$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

				}).run(function(auth) {

			// Initialize auth module with the home page and login/logout path
			// respectively
			auth.init('/', '/login', '/logout');

		});
