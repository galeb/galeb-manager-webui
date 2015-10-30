angular.module('galebWebui')
.factory("Manager", function ($resource, config) {
    return $resource(config.apiUrl + "/:path/:id", {path: '@path', id: '@id'}, {
        update: {
            method: 'PATCH'
        }
    });
})
.factory("ManagerSearch", function ($resource, config) {
    return $resource(config.apiUrl + "/:path/search/findByNameContaining?name=:search", {path: '@path', search: '@search'});
})
.factory("ManagerList", function ($resource, config) {
    return $resource(config.apiUrl + "/:path/?page=0&size=999999", {path: '@path'});
});
