angular.module('galebWebui')
.constant('config', {
  'apiUrl': 'http://localhost',
  'statsVirtualhostUrl': 'http://stats-virtualhost.localhost/',
  'statsFarmUrl': 'http://stats-farm.localhost/',
  'statusGaleb': 'http://status-galeb.localhost/',
  'statusIaaS': 'http://status-iaas.localhost/',
  'logUrl': 'http://logs.localhost/',
  'logEnv': 'dev-be',
  'alertTeam': 'Galeb',
  'alertMail': 'contact@galeb.io'
});
