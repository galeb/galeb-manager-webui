angular.module('galebWebui')
.service('AuthService', function ($http, $localStorage, Manager, CONFIG) {

    var self = {
        'loginPath': 'login',
        'logoutPath': 'logout',
        'homePath':'/',
        'isLogging': false,
        'localReset': function() {
            $localStorage.$reset();
        },
        'logIn': function(credentials, callback) {
            var headers = credentials && credentials.username ? {
                Authorization : "Basic "
                    + btoa(credentials.username + ":"
                    + credentials.password)
            } : {};

            $http.get(CONFIG.URL + "/token", {
                headers : headers
            }).then(function(response) {
                if (response.data) {
                    $localStorage.token = response.data.token;
                    $localStorage.account = response.data.account;
                    $localStorage.admin = response.data.admin;
                    self.isLogging = false;
                    callback && callback(true);
                } else {
                    self.localReset();
                    self.isLogging = false;
                    callback && callback(false);
                }
            }, function() {
                self.localReset();
                self.isLogging = false;
                callback && callback(false);
            });
        },
        'logOut': function() {
            self.localReset();
            $http.get(CONFIG.URL + "/logout");
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
        'account': function() { return $localStorage.account; }

    };

    return self;

});