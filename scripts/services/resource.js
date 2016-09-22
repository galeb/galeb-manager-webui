angular.module('galebWebui')
.factory("Manager", function ($resource, config) {
  return $resource(config.apiUrl + "/:path/:id", {path: '@path', id: '@id'}, {
    update: {
      method: 'PATCH'
    }
  });
})
.factory("ManagerSearch", function ($resource, config) {
  return $resource(config.apiUrl + "/:path/search/findByNameContaining?name=:search&page=0&size=100&sort=name", {path: '@path', search: '@search'});
})
.factory("ManagerDashboard", function ($resource, config) {
  return $resource(config.apiUrl + "/:path/?page=0&size=1", {path: '@path'});
});
