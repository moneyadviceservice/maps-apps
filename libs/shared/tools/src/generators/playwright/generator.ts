import { formatFiles, generateFiles, logger, Tree } from '@nx/devkit';

import { PlaywrightGeneratorSchema } from './schema';
import {
  APPLICATION_NAME_TOKEN,
  getPortNumber,
  PORT_NUMBER_TOKEN,
  readProjectConfig,
  replaceTokensInFiles,
  WORKSPACE_RESET_WARNING,
} from './utils';

export default async function playwrightGenerator(
  host: Tree,
  { application }: PlaywrightGeneratorSchema,
) {
  if (!application) {
    throw new Error('An application name is required.');
  }

  const applicationProjectJsonPath = `apps/${application}/project.json`;
  const projectConfig = readProjectConfig(host, applicationProjectJsonPath);
  const portNumber = getPortNumber(projectConfig, applicationProjectJsonPath);

  const e2eProjectName = `${application}-e2e`;
  const e2eProjectPath = `apps/e2e/${e2eProjectName}`;

  if (host.exists(e2eProjectPath)) {
    throw new Error(`The E2E project already exists: ${e2eProjectPath}`);
  }

  const templatePath = 'libs/shared/tools/src/generators/playwright/files';

  generateFiles(host, templatePath, e2eProjectPath, {
    application,
    e2eProjectName,
    portNumber: String(portNumber),
    tmpl: '',
  });

  const replacements = {
    [APPLICATION_NAME_TOKEN]: application,
    [PORT_NUMBER_TOKEN]: String(portNumber),
  };

  const filePaths = host
    .listChanges()
    .filter((filePath) => filePath.path.startsWith(e2eProjectPath))
    .filter(
      (filePath) => filePath.type === 'CREATE' || filePath.type === 'UPDATE',
    )
    .map((filePath) => filePath.path);

  replaceTokensInFiles(host, filePaths, replacements);

  await formatFiles(host);

  logger.warn(WORKSPACE_RESET_WARNING);
}
