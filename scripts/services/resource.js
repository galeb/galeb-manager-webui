angular.module('galebWebui')
.factory("ManagerFactory", function ($resource, API_URL) {
    return $resource(API_URL + "/:path/:id", {path: '@path', id: '@id'}, {
        update: {
            method: 'PATCH'
        }
    });
})
.factory("ManagerWithTypeFactory", function ($resource, API_URL) {
    return $resource(API_URL + "/:path/search/findByTargetTypeName?name=:type",
        {path: '@path', type: '@type'}
    );
});
