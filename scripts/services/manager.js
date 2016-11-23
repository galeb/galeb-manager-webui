angular.module('galebWebui')
.service('ManagerService', function (Manager, ManagerSearch, ManagerSearchWithSize, ManagerDashboard, $q, toastr) {

	var self = {
		'page': 0,
		'hasMore': true,
		'isLoading': false,
		'isSaving': false,
		'isDeleting': false,
		'isReloading': false,
		'isUnlocking': false,
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
						angular.forEach(self.apiLinks, function(link) {
							resource._resources(link).get(function (subItem) {
								var tmpObj = [];
								if (subItem._embeddedItems) {
									var tmpArr = [];
									var tmpArrLinks = [];
									var tmpTargetList = [];
									angular.forEach(subItem._embeddedItems, function(item) {
										if (resource.rulesOrdered) {
											tmpObj = {'id':item.id,'name':item.name,'match':item.properties.match,'global':item.global, 'selfLink': item._links.self.href};

											if (link == 'rules') {
												item._resources('pool').get(function (poolItem) {
													poolItem._resources('targets').get(function (targetItem) {
														angular.forEach(targetItem._embeddedItems, function(tempTargetItem) {
															tmpTargetList.push(tempTargetItem.name.replace('http://','').replace(/[\.:]/g,'_'));
														});
													});
												});
											}
										} else {
											tmpObj = {'id': item.id, 'name': item.name, 'href': item._links.self.href, 'selfLink': item._links.self.href};
										}
										tmpArr.push(tmpObj);
										tmpArrLinks.push(item._links.self.href);
									});
									resource[link + 'Obj'] = tmpArr;
									resource[link] = tmpArrLinks;
									resource['targetListStats'] = tmpTargetList;
								} else {
									tmpObj = {'id': subItem.id, 'name': subItem.name, 'href': subItem._links.self.href, 'selfLink': subItem._links.self.href};
									resource[link + 'Obj'] = tmpObj;
									resource[link] = subItem._links.self.href
								}
							});
						});

						resource['nameStats'] = resource.name.replace(/\./g,'_');
						resource['aliasStats'] = {};
						angular.forEach(resource.aliases, function(item) {
							resource['aliasStats'][item] = item.replace(/\./g,'_');
						});
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
				self[apiPath].size = response.page.totalElements;
			});
		},
		'loadListResources': function (apiPath, itemName = '') {
			self[apiPath] = [];
			var tmpObj = [];
			var params = {
				'path': apiPath,
				'search': itemName
			};

			ManagerSelected = itemName == '' ? ManagerSearch : ManagerSearchWithSize;

			ManagerSelected.get(params, function (response) {
				angular.forEach(response._embeddedItems, function(data) {
					tmpObj = {'id': data.id, 'name': data.name, 'href': data._links.self.href, 'selfLink': data._links.self.href};
					self[apiPath].push(tmpObj);
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
					error.statusText = self.showConflict();
				}
				toastr.error(error.status + ' - ' + error.statusText, self.errorMsg);
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
					error.statusText = self.showConflict();
				}
				toastr.error(error.status + ' - ' + error.statusText, self.errorMsg);
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
				toastr.error(error.status + ' - ' + error.statusText, self.errorMsg);
			});
			return d.promise;
		},
		'reloadFarm': function (resource) {
			var d = $q.defer();
			self.isReloading = true;
			Manager.get({'path': 'reload', 'id': resource.id}, function () {
				toastr.success(resource.name, 'Reloaded');
				d.resolve();
			}, function (error) {
				toastr.error(error.status + ' - ' + error.statusText, self.errorMsg);
			});
			self.isReloading = false;
			return d.promise;
		},
		'unlockFarm': function (resource) {
			var d = $q.defer();
			self.isUnlocking = true;
			Manager.get({'path': 'unlock', 'id': resource.id}, function () {
				toastr.success(resource.name, 'Unlocked');
				d.resolve();
			}, function (error) {
				toastr.error(error.status + ' - ' + error.statusText, 'Something was wrong');
			});
			self.isUnlocking = false;
			return d.promise;
		},
		'showConflict': function () {
			switch (self.apiPath) {
				case 'pool':
					return "Cannot delete a pool with association in rule or target";
				case 'virtualhost':
					return "Cannot delete a virtualhost with association in rule";
			}
		}

	};

	return self;

});
