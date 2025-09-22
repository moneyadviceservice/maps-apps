# Sonarqube

Sonarqube aims to accelerate Clean Code for developers and teams to enable clear, readable, understandable, maintainable, portable, reliable and secure code standards across your organization.

## Azure Pipelines based installation

The Sonarqube platform for MaPS is based on SonarCloud (paid plan). Integration between Azure Pipelines and SonarCloud is achieved via the [sonarcloud-extension-for-azure-devops](https://docs.sonarsource.com/sonarcloud/advanced-setup/ci-based-analysis/sonarcloud-extension-for-azure-devops/). Note: the integrating library for Azure DevOps differs substantially from the standalone Sonarqube. Hence, read carefully the documentation linked above and server logs should further customisation be required.

## Report exclusions

Sometimes we may disagree with the results returned in a report. We may, therefore, wish to exclude some code that has been incorrectly flagged by SonarQube.

While it’s possible to change the ruleset on the SonarQube’s server, through the control individual checks within the source code and configuration of our project, we enable source control and decisions concerning the report to be setup in a controlled manner.

Details of what rules and paths were disabled (and why) can be found in this [PWD wiki page](https://dev.azure.com.mcas.ms/moneyandpensionsservice/MaPS%20Digital/_wiki/wikis/MaPS-Digital.wiki/367/Sonar-exclusions).

## Local Installation

The installation of Sonarqube consists of a scanner, scanning and sending the code to a compute engine for analysis, and a Java application interpreting the code and generating a report.

Maps' React-based codebase requires the scanner to be installed via the command `npm install -D sonarqube-scanner`. The npm tool adds an entry to the `package.json` file and `package-lock.json`. The entry for the scanner should already be present in the codebase.

The Sonarqube application comes in several flavours. The ones we considered were: 1. Community Edition 2. Developer Edition/Enterprise.

The Community Edition is limited to creating reports on a main branch and it is the one used on the current Docker configuration.

### Docker

Sonarqube reports can be generated against a Docker instance. It is necessary that Docker Desktop is installed on the machine.

The Docker software can be freely downloaded at https://www.docker.com/products/docker-desktop/ and comes in Windows, Mac Apple and Intel chipset and Linux.

## Configure

### Project

A Sonarqube project must be created in order to be able to visualise reports.

To configure a project on Sonarqube with Docker (with the Docker engine running):

- (From the root directory of this project) run `docker-compose up` - this command will create an image of a full Sonarqube stack including the Java App and Elastic Search with an embedded database (not for production use!)
- When the message `SonarQube is operational` is logged we can navigate through a web browser to the url `http://localhost:9000` and login to the Dashboard with the default username/password of `admin`/`admin`.
- You will then be asked to set a differrent password.
- From the first screen select the `Create project manually` option.
- Create a New Project with the name `Maps project` and ensure the key is `Maps-project` (should be auto-filled).
- On the `Choose the baseline for new code for this project` screen select `Use the global setting`.
- On the `Analysis method` screen choose `locally`
- Create a token by clicking on the `Generate` button
- Copy the authentication token and follow the steps below.

### Sonar scanner

The Sonar scanner configuration is contained in `./sonarqube/sonarscan.js` file. The URL points to a locally running Docker instance of Sonarqube Community.

- Change the token value in this file to the token you have just copied.

_Important!_ the `token` - needs to correspond to the login token for the Sonarqube project - this changes per environment and must be manually updated.

## Report generation

Generating a sonar report is achieved by running from the project root the command `node ./sonarqube/sonarscan.js`.
Upon reading the message `ANALYSIS SUCCESSFUL` refresh the web browser, the newly created report can be consulted via the web interface.
