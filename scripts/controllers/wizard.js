angular.module('galebWebui')
.controller('WizardController', function (
    $scope, $modal, ManagerService, WizardHandler, SweetAlert, validationManager, $q) {

    $scope.manager = ManagerService;
    $scope.manager.selectedResource = {};

    $scope.validationStepPool = function() {
        return validationManager.validateForm(angular.element('#wizardFormPool'));
    };

    $scope.validationStepTarget = function() {
        return validationManager.validateForm(angular.element('#wizardFormTarget'));
    };

    $scope.validationStepVirtualHost = function() {
        return validationManager.validateForm(angular.element('#wizardFormVirtualHost'));
    };

    $scope.validationStepRule = function() {
        return validationManager.validateForm(angular.element('#wizardFormRule'));
    };

    $scope.showWizardModal = function () {
        $scope.data = {};

        $scope.wizardModal = $modal({
            scope: $scope,
            templateUrl: 'views/modal/wizard.html',
            show: true
        });
    };

    $scope.saveWizard = function () {

        var chain = $q.when();
        var poolID, virtualhostID;

        angular.forEach($scope.manager.selectedResource, function (value, key) {
            chain = chain.then(function() {
                if (key == 'target') {
                    value.parent = poolID;
                } else if (key == 'rule') {
                    value.pool = poolID;
                    value.parents = [];
                    value.parents[0] = virtualhostID;
                }
                return $scope.manager.createWizard(key, value).then(function (headers) {
                    if (key == 'pool') {
                        poolID = headers;
                    } else if (key == 'virtualhost') {
                        virtualhostID = headers;
                    }
                }, function (message) {
                    SweetAlert.swal({
                        title: "Ops..",
                        text: "We can't complete your wizard request!<br>Please, verify all your information and if was created.",
                        type: "error",
                        html: true,
                    });
                    $scope.wizardModal.hide();
                });
            });
        });
        SweetAlert.swal("Good job!", "You created all your entities!", "success");
        $scope.wizardModal.hide();
    };

});