const scanner = require('sonarqube-scanner');

scanner(
  {
    serverUrl: process.env.SONAR_SERVER_URL || 'http://localhost:9000',
    token: process.env.SONAR_TOKEN,
    options: {
      'sonar.projectName': 'Maps project',
      'sonar.projectDescription': 'Here I can add a description of my project',
      'sonar.projectKey': 'Maps-project',
      'sonar.projectVersion': '0.0.1',
      'sonar.exclusions': '',
      'sonar.sourceEncoding': 'UTF-8',
    },
  },
  () => process.exit(),
);
