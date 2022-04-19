angular.module('galebWebui')
.service('ManagerService', function (Manager, ManagerSearch, ManagerSearchWithSize, ManagerGenericSearch, ManagerDashboard, $q, toastr, $filter, config) {

    var self = {
        'page': 0,
        'hasMore': true,
        'isLoading': false,
        'isSaving': false,
        'isDeleting': false,
        'isSearching': false,
        'selectedResource': null,
        'resources': [],
        'listResources': [],
        'apiPath': '',
        'apiLinks': '',
        'searchText': '',
        'sortType': '',
        'errorMsg': 'Something was wrong',
        'doSearch': function () {
            self.reset();
            if (self.searchText != '') {
                self.isSearching = true;
            } else {
                self.isSearching = false;
            }
            self.loadResources();
        },
        'doSort': function (sortType) {
            self.reset();
            self.sortType = sortType;
            self.loadResources();
        },
        'init': function (path, links) {
            self.apiPath = path;
            self.apiLinks = links;
            self.reset();
        },
        'reset': function () {
            self.isLoading = false;
            self.hasMore = true;
            self.isSaving = false;
            self.page = 0;
            self.sortType = '';
            self.resources = [];
            self.listResources = [];
        },
        'actionReset': function () {
            self.selectedResource = null;
            self.reset();
            self.loadResources();
        },
        'loadResources': function () {
            if (self.hasMore && !self.isLoading) {
                self.isLoading = true;

                var params = {
                    'path': self.apiPath,
                    'page': self.page,
                    'size': '40',
                    'search': self.searchText
                };

                if (self.sortType != '') {
                    params.sort = self.sortType
                }

                if (self.searchText != '') {
                    ManagerSelected = ManagerSearch;
                } else {
                    ManagerSelected = Manager;
                }

        
                if (self.apiPath == 'account' && self.searchText != '') {
                    ManagerSelected = ManagerGenericSearch;
                    params = {'path': self.apiPath, 'searchPath': 'findByUsernameContaining', 'query': 'username=' + self.searchText + '&size=40' + '&page=' + self.page};

                } else if(self.apiPath === "virtualhostgroup" && self.searchText != ''){
                    ManagerSelected = ManagerGenericSearch;
                    params = {'path': 'virtualhostgroup', 'searchPath': 'findByVirtualhosts_NameContaining', 'query': 'name=' + self.searchText + '&size=40' + '&page=' + self.page};
                } 
                
                if (self.searchText != '' && self.searchText.indexOf('^') == 0) {
                    ManagerSelected = ManagerGenericSearch;
                    params['searchPath'] = 'findByName';
                    params['path'] = params.path;
                    params['query'] = 'name=' + self.searchText.substring(1) + '&size=10' + '&page=' + self.page;
                }                

                ManagerSelected.get(params, function (response) {
                    angular.forEach(response._embeddedItems, function(resource) {
                        var healthInfoText = [];
                        var healthInfo = {'color': 'fa-minus', 'text': healthInfoText};
                        var statusInfo = {'color': '', 'text': 'UNKNOWN'};
                        angular.forEach(self.apiLinks, function(link) {
                            resource._resources(link).get(function (subItem) {
                                var tmpObj = [];
                                if (subItem._embeddedItems) {
                                    var tmpArr = [];
                                    var tmpArrLinks = [];
                                    angular.forEach(subItem._embeddedItems, function(item) {
                                        var nameParsed = '';
                                        if (link === 'healthStatus') {
                                            tmpObj = {'id':item.id,'status':item.status,'status_detailed':item.status_detailed,'source':item.source};
                                        } else if (link === 'accounts') {
                                            tmpObj = {'id': item.id, 'username': item.username, 'href': item._links.self.href, 'selfLink': item._links.self.href};
                                        } else {
                                            nameParsed = item.name.replace(/-/g, '_').toLowerCase();
                                            tmpObj = {'id': item.id, 'name': item.name, 'nameParsed': nameParsed, 'href': item._links.self.href, 'selfLink': item._links.self.href};
                                        }
                                        tmpArr.push(tmpObj);
                                        tmpArrLinks.push(item._links.self.href);
                                    });
                                    resource[link + 'Obj'] = tmpArr;
                                    resource[link] = tmpArrLinks;

                                    if (self.apiPath === 'target') {
                                        angular.forEach(tmpArr, function(element) {
                                            if (element.status === 'HEALTHY') {
                                                healthInfo.color = 'fa-check text-success';
                                            } else if (element.status === 'FAIL') {
                                                healthInfo.color = 'fa-close text-danger';
                                            }
                                            healthInfoText.push("<b>" + element.source + "</b>: " + (element.status === 'HEALTHY' ? element.status : element.status_detailed));
                                        });
                                        if (tmpArr.length === 0) {
                                            healthInfoText.push('UNKNOWN');
                                        }
                                    }
                                } else {
                                    if (link === 'virtualhostgroup') {
                                        tmpObj = {'id': subItem.id, 'name': resource.name, 'href': subItem._links.self.href, 'selfLink': subItem._links.self.href};
                                    } else {
                                        tmpObj = {'id': subItem.id, 'name': subItem.name, 'href': subItem._links.self.href, 'selfLink': subItem._links.self.href};
                                    }
                                    resource[link + 'Obj'] = tmpObj;
                                    resource[link] = subItem._links.self.href;
                                }
                                if (self.apiPath === 'virtualhost') {
                                    resource['nameStats'] = resource.name.replace(/\./g, '_').toLowerCase();
                                } else if (self.apiPath === 'environment') {
                                    resource['nameStats'] = resource.name.replace(/-/g, '_').toLowerCase();
                                }

                            });
                        });

                        angular.forEach(resource.status, function(el) {
                            if (el === 'OK') {
                                statusInfo = {'color': 'text-success', 'text': 'OK'};
                            } else if (el === 'PENDING') {
                                statusInfo = {'color': 'text-warning', 'text': 'PENDING'};
                            } else if (el === 'DELETED') {
                                statusInfo = {'color': 'text-info', 'text': 'DELETED'};
                            }
                        });
                        resource['statusInfo'] = statusInfo;

                        resource['healthInfo'] = healthInfo;

                        resource['_links'] = '';
                        self.resources.push(resource);
                    });

                    if (!response._links || !response._links.next) {
                        self.hasMore = false;
                    }
                    self.isLoading = false;
                });
            }
        },
        'loadMore': function () {
            if (self.hasMore && !self.isLoading) {
                self.page += 1;
                self.loadResources();
            }
        },
        'loadResourcesDashboard': function(apiPath) {
            self[apiPath] = [];
            var params = {
                'path': apiPath
            };

            ManagerDashboard.get(params, function (response) {
                self[apiPath].size = response.page.total_elements;
            });
        },
        'loadListResources': function (apiPath, itemName = '') {
            self[apiPath] = [];
            var tmpObj = [];
            var params = {
                'path': apiPath,
                'search': itemName
            };

            ManagerSelected = itemName == '' ? ManagerSearch :  ManagerSearchWithSize;
    
            if(apiPath == 'account'){
                ManagerSelected = ManagerGenericSearch;
                params = {'path': apiPath, 'searchPath': 'findByUsernameContaining', 'query': 'username=' + itemName + '&size=10'};
             }

            ManagerSelected.get(params, function (response) {
                angular.forEach(response._embeddedItems, function(data) {
                    if (apiPath === 'virtualhost') {
                        data._resources('virtualhostgroup').get(function (vhg) {
                            tmpObj = {'id': data.id, 'name': data.name, 'href': vhg._links.self.href, 'selfLink': vhg._links.self.href};
                            self[apiPath].push(tmpObj);
                        });
                    } else if (apiPath === 'account') {
                        tmpObj = {'id': data.id, 'username': data.username, 'href': data._links.self.href, 'selfLink': data._links.self.href};
                        self[apiPath].push(tmpObj);
                    } else {
                        tmpObj = {'id': data.id, 'name': data.name, 'href': data._links.self.href, 'selfLink': data._links.self.href};
                        self[apiPath].push(tmpObj);
                    }
                });
            });
        },
        'updateResource': function (resource) {
            var d = $q.defer();
            self.isSaving = true;
            Manager.update({'path': self.apiPath, 'id': resource.id}, resource).$promise.then(function () {
                self.isSaving = false;
                self.actionReset();
                toastr.success(resource.name, 'Updated');
                d.resolve();
            }, function (error) {
                self.isSaving = false;
                if (error && error.data){
                    if (error.status == 409) {
                        error.data.statusText = self.showConflict();
                    }
                    toastr.error(error.status + ' - ' + error.data.statusText, self.errorMsg);
                }
                toastr.error("Unexpected error - method: updateResource ");
            });
            return d.promise;
        },
        'removeResource': function (resource) {
            var d = $q.defer();
            self.isDeleting = true;
            Manager.delete({'path': self.apiPath, 'id': resource.id}, resource).$promise.then(function () {
                self.isDeleting = false;
                self.actionReset();
                toastr.success(resource.name, 'Deleted');
                d.resolve();
            }, function (error) {
                self.isDeleting = false;
                self.selectedResource = null;
                if (error.status == 409) {
                    error.data.statusText = self.showConflict();
                }
                toastr.error(error.status + ' - ' + error.data.statusText, self.errorMsg);
            });
            return d.promise;
        },
        'createResource': function (resource) {
            var d = $q.defer();
            self.isSaving = true;
            Manager.save({'path': self.apiPath}, resource).$promise.then(function () {
                self.isSaving = false;
                self.actionReset();
                toastr.success(resource.name, 'Created');
                d.resolve();
            }, function (error) {
                self.isSaving = false;
                toastr.error(error.status + ' - ' + error.data.statusText, self.errorMsg);
            });
            return d.promise;
        },
        'showConflict': function () {
            switch (self.apiPath) {
                case 'pool':
                    return "Cannot delete a pool with association in rule or target";
                case 'virtualhost':
                    return "Cannot delete a virtualhost with association in rule";
            }
        },
        'loadReport': function (id) {
            var params = {'path': 'virtualhost', 'id': id};
            var tmpVirtualHost = {};

            Manager.get(params, function (response) {
                tmpVirtualHost.id = response.id;
                tmpVirtualHost.name = response.name;
                tmpVirtualHost.last_modified_by = response._last_modified_by;
                tmpVirtualHost.last_modified_at = response._last_modified_at;
                tmpVirtualHost.color = '';

                response._resources('environments').get(function (envVH) {
                    var arrEnv = [];
                    angular.forEach(envVH._embeddedItems, function(env) {
                        var sync = '';
                        if (response.status[env.id] === 'OK') {
                            sync = 'text-success';
                            tmpVirtualHost.color = 'text-success';
                        } else if (response.status[env.id] === 'PENDING') {
                            sync = 'text-warning';
                            tmpVirtualHost.color = 'text-warning';
                        } else if (response.status[env.id] === 'DELETED') {
                            sync = 'text-info';
                            tmpVirtualHost.color = 'text-info';
                        }
                        arrEnv.push("&nbsp;&nbsp;&nbsp;<b>" + env.name + "</b> &nbsp;<i class='fa fa-circle fa-envs " + sync + "'></i>");
                    });
                    tmpVirtualHost.environment = arrEnv.join("<br>");
                });

                response._resources('virtualhostgroup').get(function (vhGroup) {
                    vhGroup._resources('rulesordered').get(function (rulesOrdered) {
                        var arrRules = [];
                        angular.forEach(rulesOrdered._embeddedItems, function(rulesOrdered_rule) {
                            rulesOrdered_rule._resources('rule').get(function (ruleInfo) {
                                var tmpRule = {};
                                ruleInfo._resources('self').get(function (rule) {
                                    var arrPools = [];
                                    ruleInfo._resources('pools').get(function (pools) {
                                        angular.forEach(pools._embeddedItems, function(poolInfo) {
                                            poolInfo._resources('self').get(function (pool) {
                                                var tmpPool = {};
                                                tmpPool.id = pool.id;
                                                tmpPool.name = pool.name;
                                                tmpPool.last_modified_by = pool._last_modified_by;
                                                tmpPool.last_modified_at = pool._last_modified_at;

                                                tmpPool.hc_path = pool.hc_path;
                                                tmpPool.hc_http_status_code = pool.hc_http_status_code;
                                                tmpPool.hc_host = pool.hc_host;
                                                tmpPool.hc_http_method = pool.hc_http_method;
                                                tmpPool.hc_body = pool.hc_body;
                                                tmpPool.color = '';

                                                var envPoolId;
                                                pool._resources('environment').get(function (envPOOL) {
                                                    tmpPool.environment = envPOOL.name;
                                                    envPoolId = envPOOL.id;

                                                    if (pool.status[envPoolId] === 'OK') {
                                                        tmpPool.color = 'text-success';
                                                    } else if (pool.status[envPoolId] === 'PENDING') {
                                                        tmpPool.color = 'text-warning';
                                                    } else if (pool.status[envPoolId] === 'DELETED') {
                                                        tmpPool.color = 'text-info';
                                                    }
                                                });

                                                pool._resources('balancepolicy').get(function (envBALANCE) {
                                                    tmpPool.balance = envBALANCE.name;
                                                });

                                                var arrTargets = [];
                                                pool._resources('targets').get(function (targets) {
                                                    angular.forEach(targets._embeddedItems, function (targetInfo) {
                                                        var tmpTarget = {};
                                                        var arrHS = [];
                                                        targetInfo._resources('healthStatus').get(function (healthstatusInfo) {
                                                            angular.forEach(healthstatusInfo._embeddedItems, function (healthstatus) {
                                                                var tmpHS = {};
                                                                tmpHS.id = healthstatus.id;
                                                                tmpHS.status_detailed = healthstatus.status_detailed;
                                                                tmpHS.source = healthstatus.source;
                                                                tmpHS.last_modified_at = healthstatus._last_modified_at;
                                                                tmpHS.icon = healthstatus.status === 'HEALTHY' ? 'fa-check text-success' : 'fa-close text-danger';

                                                                if (healthstatus.status === 'HEALTHY') {
                                                                    tmpHS.info = "<br>Status: <b>" + healthstatus.status + "</b>";
                                                                } else {
                                                                    tmpHS.info = "<br>Status: <b>" + healthstatus.status + "</b><br>Status Detailed: <b>" + healthstatus.status_detailed + "</b>";
                                                                }
                                                                arrHS.push(tmpHS);
                                                            });

                                                        });
                                                        targetInfo._resources('self').get(function (target) {
                                                            tmpTarget.id = target.id;
                                                            tmpTarget.name = target.name;
                                                            tmpTarget.status = target.status;
                                                            tmpTarget.last_modified_by = target._last_modified_by;
                                                            tmpTarget.last_modified_at = target._last_modified_at;
                                                            tmpTarget.healthStatus = arrHS;
                                                            tmpTarget.color = '';

                                                            if (target.status[envPoolId] === 'OK') {
                                                                tmpTarget.color = 'text-success';
                                                            } else if (target.status[envPoolId] === 'PENDING') {
                                                                tmpTarget.color = 'text-warning';
                                                            } else if (target.status[envPoolId] === 'DELETED') {
                                                                tmpTarget.color = 'text-info';
                                                            }
                                                            arrTargets.push(tmpTarget);
                                                        });
                                                    });
                                                });
                                                tmpPool.targets = arrTargets;
                                                arrPools.push(tmpPool);
                                            });
                                        });
                                    });

                                    tmpRule.id = rule.id;
                                    tmpRule.name = rule.name;
                                    tmpRule.color = '';
                                    tmpRule.last_modified_by = rule._last_modified_by;
                                    tmpRule.last_modified_at = rule._last_modified_at;
                                    tmpRule.order = rulesOrdered_rule.order;
                                    tmpRule.match = rule.matching;
                                    tmpRule.global = rule.global;
                                    tmpRule.pools = arrPools;

                                    rulesOrdered_rule._resources('environment').get(function (envRuleOredered) {
                                        tmpRule.environment = envRuleOredered.name;

                                        if (rule.status[envRuleOredered.id] === 'OK') {
                                            tmpRule.color = 'text-success';
                                        } else if (rule.status[envRuleOredered.id] === 'PENDING') {
                                            tmpRule.color = 'text-warning';
                                        } else if (rule.status[envRuleOredered.id] === 'DELETED') {
                                            tmpRule.color = 'text-info';
                                        }
                                    });

                                    arrRules.push(tmpRule);
                                });
                            });
                        });
                        tmpVirtualHost.rules = arrRules;
                    });
                });
                self.selectedResource = tmpVirtualHost;
            });
        },
        'createWizard': function (key, resource) {
            var d = $q.defer();
            Manager.save({'path': key}, resource, function (data, headers) {
                d.resolve(headers('Location'));
            }, function (error) {
                d.reject(error);
            });
            return d.promise;
        },
        'loadRuleOredered': function (vhgID, envID, envName) {
            var params = {'path': 'ruleordered', 'searchPath': 'findByVirtualhostgroupIdAndEnvironmentId', 'query': 'vhgid=' + vhgID + '&envid=' + envID + '&size=1000'};
            var arrRules = [];
            var d = $q.defer();

            self.selectedResource = {'virtualhostgroup': config.apiUrl + '/virtualhostgroup/' + vhgID};
            self.selectedResource.environment = config.apiUrl + '/environment/' + envID;
            self.selectedResource.environment_id = envID;
            self.selectedResource.environment_name = envName;
            self.selectedResource.arrayRuleRemove = [];
            self.selectedResource.arrayRuleOrder = [];

            ManagerGenericSearch.get(params, function (response) {
                angular.forEach(response._embeddedItems, function(ruleOrderItem) {
                    ruleOrderItem._resources('rule').get(function (ruleInfo) {
                        ruleOrderItem._resources('environment').get(function (envInfo) {
                            if (envInfo.id === envID) {
                                tmpRuleOrderItem = {
                                    'id': ruleOrderItem.id,
                                    'order': ruleOrderItem.order,
                                    'rule': ruleInfo._links.self.href,
                                    'environment': envInfo._links.self.href,
                                    'ruleInfo': {
                                        'id': ruleInfo.id,
                                        'name': ruleInfo.name,
                                        'matching': ruleInfo.matching
                                    }
                                };
                                arrRules.push(tmpRuleOrderItem);
                                if (arrRules.length === response._embeddedItems.length) {
                                    d.resolve(arrRules);
                                }
                            }
                        });
                    });
                });
            });
            return d.promise;
        },
        'loadRuleInformation': function(ruleId) {
            var params = {'path': 'rule', 'id': ruleId};
            var d = $q.defer();

            Manager.get(params, function (response) {
                var tmpInfo = {
                    'rule': response._links.self.href,
                    'ruleInfo': {
                        'id': response.id,
                        'name': response.name,
                        'matching': response.matching
                    }
                };
                d.resolve(tmpInfo);
            });
            return d.promise;
        },
        'loadEnvironmentInformation': function(envId, ruleInfo) {
            var params = {'path': 'environment', 'id': envId};
            var d = $q.defer();

            Manager.get(params, function (response) {
                ruleInfo['environment'] = response._links.self.href;
                ruleInfo['environment_name'] = response.name;
                d.resolve(ruleInfo);
            });
            return d.promise;
        },
        'updateRuleOrder': function (resource) {
            var d = $q.defer();
            Manager.update({'path': 'ruleordered', 'id': resource.id}, resource).$promise.then(function () {
                toastr.success(resource.name, 'Updated');
                d.resolve();
            }, function (error) {
                d.reject('Error trying update rule ordered.');
            });
            return d.promise;
        },
        'removeRuleOrder': function (resource) {
            var d = $q.defer();
            Manager.delete({'path': 'ruleordered', 'id': resource.id}, resource).$promise.then(function () {
                toastr.success(resource.name, 'Deleted');
                d.resolve();
            }, function (error) {
                d.reject('Error tryging delete rule ordered.');
            });
            return d.promise;
        },
        'createRuleOrder': function (resource) {
            var d = $q.defer();
            Manager.save({'path': 'ruleordered'}, resource).$promise.then(function () {
                toastr.success(resource.name, 'Created');
                d.resolve();
            }, function (error) {
                d.reject('Error tryging create rule ordered.')
            });
            return d.promise;
        },

    };

    return self;

});
