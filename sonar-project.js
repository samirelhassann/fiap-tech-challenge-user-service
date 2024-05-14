const sonarqubeScanner = require('sonarqube-scanner');
require('dotenv').config();

sonarqubeScanner({
  serverUrl: 'https://sonarcloud.io',
  token: process.env.SONAR_TOKEN,
  options: {
    'sonar.projectKey': process.env.SONAR_PROJECT_KEY,
    'sonar.organization': process.env.SONAR_ORGANIZATION,
    'sonar.sources': 'src',
    'sonar.tests': 'test',
    'sonar.test.inclusions': '**/*.spec.ts,**/*.test.ts',
    'sonar.typescript.lcov.reportPaths': 'coverage/lcov.info',
  }
}, () => { });