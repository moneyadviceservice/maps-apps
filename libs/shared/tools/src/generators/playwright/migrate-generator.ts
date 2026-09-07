import { formatFiles, generateFiles, logger, Tree } from '@nx/devkit';

import { PlaywrightGeneratorSchema } from './schema';
import {
  APPLICATION_NAME_TOKEN,
  getPortNumber,
  listFilesRecursively,
  normalizeE2EProjectName,
  PORT_NUMBER_TOKEN,
  readProjectConfig,
  readRequiredFile,
  replaceTokensInFiles,
  WORKSPACE_RESET_WARNING,
} from './utils';

function validateProjectPaths(
  host: Tree,
  projectPath: string,
  projectJsonPath: string,
  cypressConfigPath: string,
  playwrightConfigPath: string,
) {
  if (!host.exists(projectJsonPath)) {
    throw new Error(`The E2E project folder does not exist: ${projectPath}`);
  }

  if (host.exists(playwrightConfigPath)) {
    throw new Error(
      `The E2E project already looks migrated: ${playwrightConfigPath}`,
    );
  }

  if (!host.exists(cypressConfigPath)) {
    throw new Error(
      `The E2E project does not contain a cypress.config.ts file: ${projectPath}`,
    );
  }
}

function archiveProjectFiles(
  host: Tree,
  projectPath: string,
  archivedCypressPath: string,
  projectJsonPath: string,
  archivedProjectJsonPath: string,
  sourceProjectJson: string,
) {
  const filesToArchive = listFilesRecursively(host, projectPath).filter(
    (filePath) => filePath !== projectJsonPath,
  );

  for (const filePath of filesToArchive) {
    const relativePath = filePath.replace(`${projectPath}/`, '');
    const destinationPath = `${archivedCypressPath}/${relativePath}`;
    const fileContent = host.read(filePath, 'utf-8');

    if (fileContent !== null) {
      host.write(destinationPath, fileContent);
    }

    host.delete(filePath);
  }

  host.write(archivedProjectJsonPath, `${sourceProjectJson}\n`);
  host.delete(projectJsonPath);
}

export default async function migratePlaywrightGenerator(
  host: Tree,
  { application }: PlaywrightGeneratorSchema,
) {
  if (!application) {
    throw new Error('An application name is required.');
  }

  const normalizedApplication = normalizeE2EProjectName(application);
  const projectPath = `apps/e2e/${normalizedApplication}`;
  const projectJsonPath = `${projectPath}/project.json`;
  const cypressConfigPath = `${projectPath}/cypress.config.ts`;
  const playwrightConfigPath = `${projectPath}/playwright.config.ts`;
  const archivedCypressPath = `${projectPath}/archived-cypress`;
  const archivedProjectJsonPath = `${archivedCypressPath}/project.old.json`;

  validateProjectPaths(
    host,
    projectPath,
    projectJsonPath,
    cypressConfigPath,
    playwrightConfigPath,
  );

  const sourceProjectJson = readRequiredFile(host, projectJsonPath);
  const targetAppName = normalizedApplication.replace(/-e2e$/, '');
  const targetAppProjectPath = `apps/${targetAppName}/project.json`;

  if (!host.exists(targetAppProjectPath)) {
    throw new Error(`The app project does not exist: ${targetAppProjectPath}`);
  }

  const appProjectConfig = readProjectConfig(host, targetAppProjectPath);
  const portNumber = getPortNumber(appProjectConfig, targetAppProjectPath);

  archiveProjectFiles(
    host,
    projectPath,
    archivedCypressPath,
    projectJsonPath,
    archivedProjectJsonPath,
    sourceProjectJson,
  );

  const templatePath = 'libs/shared/tools/src/generators/playwright/files';
  generateFiles(host, templatePath, projectPath, {
    application: targetAppName,
    e2eProjectName: normalizedApplication,
    portNumber: String(portNumber),
    tmpl: '',
  });

  const replacements = {
    [APPLICATION_NAME_TOKEN]: targetAppName,
    [PORT_NUMBER_TOKEN]: String(portNumber),
  };

  replaceTokensInFiles(
    host,
    listFilesRecursively(host, projectPath),
    replacements,
  );

  await formatFiles(host);
  logger.warn(WORKSPACE_RESET_WARNING);
}
