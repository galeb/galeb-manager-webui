angular.module('galebWebui')
.service('AuthService', function ($http, $localStorage, config) {

  var self = {
    'loginPath': 'login',
    'logoutPath': 'logout',
    'homePath':'/',
    'isLogging': false,
    'errorMsg': '',
    'localReset': function() {
      $localStorage.$reset();
    },
    'logIn': function(credentials, callback) {
      var headers = credentials && credentials.username ? {
        Authorization : "Basic "
        + btoa(credentials.username + ":"
        + credentials.password)
      } : {};

      $http.get(config.apiUrl + "/token", {
        headers : headers
      }).then(function(response) {
        if (response.data) {
          $localStorage.token = response.data.token;
          $localStorage.username = response.data.username;
          $localStorage.admin = response.data.admin;
          $localStorage.email = response.data.email;
          self.isLogging = false;
          callback && callback(true);
        } else {
          self.localReset();
          self.isLogging = false;
          callback && callback(false);
        }
      }, function(response) {
        if (response.status === 401) {
          self.errorMsg = 'Please enter the correct username and password!';
        } else if (response.status === 0) {
            self.errorMsg = 'There was a problem to connect with Galeb API!';
        } else if (response.status === -1) {
          self.errorMsg = 'There was a problem with Galeb API, please contact administrator!';
        }
        self.localReset();
        self.isLogging = false;
        callback && callback(false);
      });
    },
    'logOut': function() {
      self.localReset();
    },
    'isLoggedIn': function() {
      if ($localStorage.token) {
        return true;
      } else {
        self.localReset();
        return false;
      }
    },
    'isAdmin': function() { return $localStorage.admin ? true : false; },
    'username': function() { return $localStorage.username; },
    'email': function() { return $localStorage.email; }
  };

  return self;
});
