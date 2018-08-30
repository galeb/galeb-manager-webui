angular.module('galebWebui')
.constant('config', {
  'apiUrl': 'http://localhost:80',
  'statsVirtualhostUrl': 'stats-virtualhost',
  'statsEnvUrl': 'stats-env',
  'statsUrlEnv': "['env']",
  'statusIaaS': 'status-iaas',
  'logUrlProdBE': 'logs-prod-be',
  'logUrlProdFE': 'logs-prod-fe',
  'logUrlDev': 'logs-dev',
  "healthColor": {
    'OK': ' fa-check text-success',
    'UNKNOWN': ' fa-close text-danger',
    'FAIL': ' fa-close text-danger'
  },
  "links_monitors": ['hash-links-monitors']
});
