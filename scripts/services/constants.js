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
  "syncColor": {
    'OK': ' text-success',
    'ERROR': ' text-danger',
    'PENDING': ' text-warning'
  },
  "healthColor": {
      'OK': ' fa-check text-success',
      'UNKNOWN': ' fa-close text-danger'
  },
  "links_monitors": "hash-links-monitors"
});
