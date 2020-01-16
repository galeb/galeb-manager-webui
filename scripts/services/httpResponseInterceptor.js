angular.module('galebWebui')
.factory('httpResponseInterceptor', function($q, $location, $localStorage, $window) {
  return {
    'request': function (config) {
      config.headers = config.headers;
      if ($localStorage.token && $localStorage.username) {
        config.headers['Authorization'] = 'Basic ' + btoa($localStorage.username + ":" + $localStorage.token);
      }
      return config;
    },
    'responseError': function(response) {
      if (response.status === -1) {
        $localStorage.$reset();
        $location.path('login');
      } else if (response.status === 401) {
        $localStorage.$reset();
        $location.path('logout');
        $window.location.reload();
      }
      return $q.reject(response);
    }
  };
});
