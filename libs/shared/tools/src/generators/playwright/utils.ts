import { Tree } from '@nx/devkit';

export const APPLICATION_NAME_TOKEN = '<APPLICATION_NAME>';
export const PORT_NUMBER_TOKEN = '<PORT_NUMBER>';

export const WORKSPACE_RESET_WARNING = `The workspace graph has changed.

After this generator completes, run:

  nx reset

before running affected/build/test commands.
`;

export function normalizeE2EProjectName(application: string) {
  const trimmedApplication = application
    .replace(/^apps\/e2e\//, '')
    .replace(/^apps\//, '')
    .trim();

  return trimmedApplication.endsWith('-e2e')
    ? trimmedApplication
    : `${trimmedApplication}-e2e`;
}

export function listFilesRecursively(host: Tree, directory: string): string[] {
  if (!host.exists(directory)) {
    return [];
  }

  const files: string[] = [];

  for (const child of host.children(directory)) {
    const childPath = `${directory}/${child}`;
    if (host.isFile(childPath)) {
      files.push(childPath);
      continue;
    }

    files.push(...listFilesRecursively(host, childPath));
  }

  return files;
}

export function readRequiredFile(
  host: Tree,
  filePath: string,
  errorMessage?: string,
) {
  const fileContent = host.read(filePath, 'utf-8');

  if (!fileContent) {
    throw new Error(errorMessage ?? `Could not read ${filePath}`);
  }

  return fileContent;
}

export function readProjectConfig(host: Tree, projectPath: string) {
  return JSON.parse(readRequiredFile(host, projectPath)) as Record<
    string,
    unknown
  >;
}

export function getPortNumber(
  projectConfig: Record<string, unknown>,
  projectPath: string,
) {
  const targets = (projectConfig.targets as Record<string, unknown>) ?? {};
  const serveTarget = (targets.serve as Record<string, unknown>) ?? {};
  const serveOptions = (serveTarget.options as Record<string, unknown>) ?? {};
  const portNumber = serveOptions.port;

  if (!portNumber) {
    throw new Error(
      `${projectPath} does not contain a port number under targets.serve.options.port`,
    );
  }

  return portNumber;
}

export function reorderProjectConfig(projectConfig: Record<string, unknown>) {
  const orderedProjectConfig: Record<string, unknown> = {};
  const orderedKeys = new Set([
    'name',
    '$schema',
    'sourceRoot',
    'projectType',
    'implicitDependencies',
    'tags',
    'targets',
  ]);

  for (const key of Array.from(orderedKeys.values())) {
    if (key in projectConfig) {
      orderedProjectConfig[key] = projectConfig[key];
    }
  }

  for (const [key, value] of Object.entries(projectConfig)) {
    if (!orderedKeys.has(key)) {
      orderedProjectConfig[key] = value;
    }
  }

  return orderedProjectConfig;
}

export function writeProjectConfig(
  host: Tree,
  projectJsonPath: string,
  projectConfig: Record<string, unknown>,
) {
  host.write(
    projectJsonPath,
    `${JSON.stringify(reorderProjectConfig(projectConfig), null, 2)}\n`,
  );
}

export function replaceTokensInFiles(
  host: Tree,
  filePaths: string[],
  replacements: Record<string, string>,
) {
  for (const filePath of filePaths) {
    const fileContent = host.read(filePath, 'utf-8');
    if (!fileContent) {
      continue;
    }

    let updatedContent = fileContent;
    for (const [token, replacement] of Object.entries(replacements)) {
      updatedContent = updatedContent.replaceAll(token, replacement);
    }

    host.write(filePath, updatedContent);
  }
}
