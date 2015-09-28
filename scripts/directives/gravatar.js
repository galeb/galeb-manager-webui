angular.module('galebWebui')
.directive('gwGravatar', function() {
 return {
   restrict: 'AE',
   replace: true,
   scope: {
     name: '@',
     height: '@',
     width: '@',
     emailHash: '@'
   },
   link: function(scope, el, attr) {
     scope.url = "https://secure.gravatar.com/avatar/" + scope.emailHash + ".jpg?s=" + scope.width;
   },
   template: '<img alt="{{ name }}" class="img-rounded" height="{{ height }}"  width="{{ width }}" ng-src="{{ url }}">'
 };
});