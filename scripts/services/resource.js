angular.module('galebWebui')
.factory("Manager", function ($resource, CONFIG) {
    return $resource(CONFIG.URL + "/:path/:id", {path: '@path', id: '@id'}, {
        update: {
            method: 'PATCH'
        }
    });
})
.factory("ManagerWithTypeFactory", function ($resource, CONFIG) {
    return $resource(CONFIG.URL + "/:path/search/findByTargetTypeName?name=:type",
        {path: '@path', type: '@type'}
    );
});
