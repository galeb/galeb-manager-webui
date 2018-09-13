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
										if (link === 'healthStatus') {
                                            tmpObj = {'id':item.id,'status':item.status,'status_detailed':item.status_detailed,'source':item.source};
                                        } else {
											tmpObj = {'id': item.id, 'name': item.name, 'href': item._links.self.href, 'selfLink': item._links.self.href};
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
				params = {'path': apiPath, 'searchPath': 'findByuserName', 'query': 'username=' + itemName + '&size=10'};
			 }
			 
			ManagerSelected.get(params, function (response) {
				angular.forEach(response._embeddedItems, function(data) {
                    if (apiPath === 'virtualhost') {
                        data._resources('virtualhostgroup').get(function (vhg) {
                            tmpObj = {'id': data.id, 'name': data.name, 'href': vhg._links.self.href, 'selfLink': vhg._links.self.href};
                            self[apiPath].push(tmpObj);
                        });
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
				if (error.status == 409) {
					error.data.statusText = self.showConflict();
				}
				toastr.error(error.status + ' - ' + error.data.statusText, self.errorMsg);
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
				tmpVirtualHost.status = response._status;
				tmpVirtualHost.rulesOrdered = response.rulesOrdered;

				response._resources('environment').get(function (envVH) {
					tmpVirtualHost.environment = envVH.name;
				});

				response._resources('rules').get(function (rules) {
					var arrRules = [];
					angular.forEach(rules._embeddedItems, function(rule) {
						var tmpPool = {};
						rule._resources('pool').get(function (pool) {
							tmpPool.id = pool.id;
							tmpPool.name = pool.name;
							tmpPool.status = pool._status;

							hcPool = "HealthCheck TCP";
							if (pool.properties.hcPath) {
								hcPool = "HealthCheck HTTP <br> Path: <b>" + pool.properties.hcPath
									+ "</b><br> StatusCode: <b>" + pool.properties.hcStatusCode
									+ "</b><br> Host: <b>" + pool.properties.hcHost
									+ "</b><br> Body: <b>" + pool.properties.hcBody + "</b>";
							}
							tmpPool.tooltip = hcPool;

							pool._resources('environment').get(function (envPOOL) {
								tmpPool.environment = envPOOL.name;
							});

							pool._resources('balancePolicy').get(function (envBALANCE) {
								tmpPool.balance = envBALANCE.name;
							});

							var arrTargets = [];
							pool._resources('targets').get(function (targets) {
								angular.forEach(targets._embeddedItems, function(target) {
									tmpTarget = {
										'id': target.id,
										'name': target.name,
										'status': target._status,
										'healthy': target.properties.healthy,
										'status_detailed': target.properties.status_detailed
									};
									if (target.properties.status_detailed != 'OK') {
										tmpTarget.detailed = "<br>Details: <b>" + target.properties.status_detailed  + "</b>"
									}
									arrTargets.push(tmpTarget);
								});
							});
							tmpPool.targets = arrTargets;
						});

						tmpRule = {
							'id': rule.id,
							'name': rule.name,
							'match': rule.properties.match,
							'global': rule.global,
							'status': rule._status,
							'pool': tmpPool
						};

						tmpVirtualHost.rulesOrdered.some(function(item) {
							if (item.ruleId == rule.id) {
								tmpRule.ruleOrder = item.ruleOrder;
								return true;
							} else {
								tmpRule.ruleOrder = 999999;
							}
						});
						arrRules.push(tmpRule);
					});

					tmpVirtualHost.rules = $filter('orderBy')(arrRules, 'ruleOrder');
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
            var params = {'path': 'ruleordered', 'searchPath': 'findByVirtualhostgroupIdAndEnvironmentId', 'query': 'vhgid=' + vhgID + '&envid=' + envID};
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
