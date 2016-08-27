angular.module('galebWebui')
.directive('gwGravatar',['md5', function(md5) {
 return {
   restrict: 'AE',
   replace: true,
   scope: {
     name: '@',
     height: '@',
     width: '@',
     email: '@'
   },
   link: function(scope, el, attr) {
     scope.url = "https://secure.gravatar.com/avatar/" + md5.createHash(scope.email || '') + ".jpg?s=" + scope.width;
   },
   template: '<img alt="{{ name }}" class="img-rounded" height="{{ height }}"  width="{{ width }}" ng-src="{{ url }}">'
 };
}]);