angular.module('galebWebui')
.controller('AuthController', function ($scope, $location, $state, toastr, AuthService) {

    $scope.credentials = {};
    $scope.currentUser = '';

    $scope.auth = AuthService;

    $scope.isAuthenticated = function() {
        return $scope.auth.isLoggedIn();
    }

    $scope.isAdmin = function() {
        return $scope.auth.isAdmin();
    }

    $scope.currentUser = $scope.auth.account();

    $scope.login = function() {
        $scope.auth.logIn($scope.credentials, function(authenticated) {
            if (authenticated) {
                toastr.success('Login succeeded!');
                $state.go('dashboard');
            } else {
                $scope.auth.logOut();
                toastr.error('Please try again.', 'There was a problem logging in!');
                $state.go('login');
            }
        });
    };
})
.controller('LogoutController', function ($scope, $state, AuthService) {
    $scope.logout = AuthService;
    $scope.logout.logOut();

    $scope.returnLogin = function() {
        $state.go('login');
    }
});