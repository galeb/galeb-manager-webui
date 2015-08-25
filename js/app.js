angular
		.module('hello', [ 'ngRoute', 'ui.bootstrap', 'angular-hal', 'auth', 'home', 'api', 'navigation' ])
		.config(

				function($routeProvider, $httpProvider, $locationProvider) {

					$locationProvider.html5Mode(true);

					$routeProvider.when('/', {
						templateUrl : 'home.html',
						controller : 'home'
					}).when('/environment', {
						templateUrl : 'environment.html',
						controller : 'ApiController'
					}).when('/target', {
						templateUrl : 'target.html',
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
