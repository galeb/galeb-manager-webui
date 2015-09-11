angular.module('navigation', ['auth']).controller(
    'navigation',

    function($scope, auth, $window, $location) {

        $scope.credentials = {};

        $scope.authenticated = function() {
            return auth.isLoggedIn();
        }

        $scope.login = function() {
            auth.authenticate($scope.credentials, function(authenticated) {
                if (authenticated) {
                    console.log("Login succeeded");
                    $scope.error = false;
                } else {
                    console.log("Login failed");
                    $scope.logout;
                    $scope.error = true;
                }
            })
        };

        $scope.logout = function() {
            auth.clear();
        }

    });
