angular.module('navigation', ['auth']).controller(
    'navigation',

    function($scope, auth, $window, $location) {

        $scope.credentials = {};

        $scope.authenticated = function() {
            if ($window.sessionStorage.getItem('galeb')) {
                return true;
            } else {
                $location.path(auth.loginPath);
                return false;
            }
        }

        $scope.login = function() {
            auth.authenticate($scope.credentials, function(authenticated) {
                if ($scope.authenticated) {
                    console.log("Login succeeded")
                    $scope.error = false;
                } else {
                    console.log("Login failed")
                    $scope.error = true;
                }
            })
        };

        $scope.logout = function() {
            auth.clear();
        }

    });
