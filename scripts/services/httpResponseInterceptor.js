angular.module('galebWebui')
.factory('httpResponseInterceptor', function($q, $location, $localStorage, $window) {
  return {
    'request': function (config) {
      config.headers = config.headers || {};
      if ($localStorage.token) {
        config.headers['x-auth-token'] = $localStorage.token;
      }
      return config;
    },
    'responseError': function(response) {
      if (response.status === -1) {
        $localStorage.$reset();
        $location.path('login');
      } else if (response.status === 401 || response.status === 403) {
        $localStorage.$reset();
        $location.path('logout');
        $window.location.reload();
      }
      return $q.reject(response);
    }
  };
});
