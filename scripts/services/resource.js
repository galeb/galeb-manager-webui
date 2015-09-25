angular.module('galebWebui')
.factory("Manager", function ($resource, config) {
    return $resource(config.apiUrl + "/:path/:id", {path: '@path', id: '@id'}, {
        update: {
            method: 'PATCH'
        }
    });
});
