angular.module('galebWebui')
.constant('config', {
  'apiUrl': 'api-url',
  'statsVirtualhostUrl': 'stats-virtualhost',
  'statsFarmUrl': 'stats-farm',
  'statsUrlEnv': "['env']",
  'statusGaleb': 'status-galeb',
  'statusIaaS': 'status-iaas',
  'logUrlProd': 'logs-prod',
  'logUrlDev': 'logs-dev',
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
