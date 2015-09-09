angular.module('auth', []).factory(
    'auth',

    function($http, $location, $window) {

      var auth = {

        loginPath : '/login',
        logoutPath : '/logout',
        homePath : '/',

        authenticate : function(credentials, callback) {

          var headers = credentials && credentials.username ? {
            authorization : "Basic "
                + btoa(credentials.username + ":"
                    + credentials.password)
          } : {};

          $http.get(baseUrl + auth.loginPath, {
            headers : headers
        }).success(function(data) {
            $window.sessionStorage.setItem('galeb', data);
            $location.path(auth.homePath);
            callback && callback(true);
          }).error(function() {
            $window.sessionStorage.removeItem('galeb');
            $location.path(auth.loginPath);
            callback && callback(false);
          });

        },

        clear : function() {
            $window.sessionStorage.removeItem('galeb');
            $http.get(baseUrl + auth.logoutPath);
            $location.path(auth.loginPath);
        },

        init : function(homePath, loginPath, logoutPath) {
            auth.homePath = homePath;
            auth.loginPath = loginPath;
            auth.logoutPath = logoutPath;
        }

      };

      return auth;

    });
