angular.module('auth', []).factory(
    'auth',

    function($http, $location, $window) {

      var auth = {

        loginPath : '/login',
        logoutPath : '/logout',
        homePath : '/',

        authenticate : function(credentials, callback) {

            var headers = credentials && credentials.username ? {
                Authorization : "Basic "
                    + btoa(credentials.username + ":"
                    + credentials.password)
            } : {};

            $http.get(baseUrl, {
                headers : headers
            }).then(function(response) {
                var token = response.headers('x-auth-token');
                if (token !== '') {
                    $window.localStorage.setItem('galeb', token);
                    $http.defaults.headers.common['X-Auth-Token'] = token;
                    $http.defaults.headers.common.Authorization = 'Basic ';
                } else {
                    $window.localStorage.clear();
                }
                $location.path(auth.homePath);
                callback && callback(true);
            }, function(response) {
                $window.localStorage.clear();
                callback && callback(false);
            });
        },

        clear : function() {
            $window.localStorage.clear();
            $http.get(baseUrl + auth.logoutPath);
            $location.path(auth.loginPath);
        },

        init : function(homePath, loginPath, logoutPath) {
            auth.homePath = homePath;
            auth.loginPath = loginPath;
            auth.logoutPath = logoutPath;
        },

        isLoggedIn : function() {
            if ($window.localStorage.getItem('galeb')) {
                return true;
            } else {
                $window.localStorage.clear();
                return false;
            }
        },

      };

      return auth;

    });
