angular.module('galebWebui')
.constant('config', {
  'apiUrl': 'http://localhost',
  'statsVirtualhostUrl': 'http://stats-virtualhost.localhost/',
  'statsFarmUrl': 'http://stats-farm.localhost/',
  'statsUrlEnv': "['dev']",
  'statusGaleb': 'http://status-galeb.localhost/',
  'statusIaaS': 'http://status-iaas.localhost/',
  'logUrlProd': 'http://logs-prod.localhost/',
  'logUrlDev': 'http://logs-dev.localhost/',
  'alertTeam': 'Galeb',
  'alertMail': 'contact@galeb.io',
  "statusColor": {
    'OK': ' text-success',
    'ERROR': ' text-danger',
    'UNKNOWN': ' fa-minus text-default',
    'PENDING': ' text-warning',
    'HEALTHY': ' fa-check text-success',
    'DEAD': ' fa-close text-danger',
  }
});
