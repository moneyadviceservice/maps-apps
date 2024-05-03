const scanner = require('sonarqube-scanner');

scanner(
  {
    serverUrl: 'http://localhost:9000',
    token: 'sqp_bd71ebcd3157633da4ac81df45ce84e1758920db',
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
