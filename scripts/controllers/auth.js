angular.module('galebWebui')
.controller('AuthController', function ($rootScope, $scope, $location, $state, toastr, config, AuthService) {

  $scope.credentials = {};
  $scope.currentUser = '';

  $scope.auth = AuthService;

  $scope.isAuthenticated = function() {
    return $scope.auth.isLoggedIn();
  }

  $rootScope.isAdmin = function() {
    return $scope.auth.isAdmin();
  }

  $scope.currentUser = $scope.auth.account();
  $scope.email = $scope.auth.account() + '@' + config.domain;

  $scope.login = function() {
    $scope.auth.logIn($scope.credentials, function(authenticated) {
      if (authenticated) {
        toastr.success('Login succeeded!');
        $state.go('dashboard');
      } else {
        $scope.auth.logOut();
        toastr.error($scope.auth.errorMsg, 'Ops..');
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
