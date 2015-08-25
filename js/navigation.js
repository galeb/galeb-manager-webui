angular.module('navigation', ['auth']).controller(
    'navigation',

    function($scope, auth) {

        $scope.credentials = {};

        $scope.authenticated = function() {
            return auth.authenticated;
        }

        $scope.login = function() {
            auth.authenticate($scope.credentials, function(authenticated) {
                if (authenticated) {
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
