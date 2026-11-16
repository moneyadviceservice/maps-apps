import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getProjects,
  logger,
  names,
  Tree,
} from '@nx/devkit';

import playwrightGenerator from '../playwright/generator';
import { registerApp } from './registrations';
import { AppGeneratorSchema } from './schema';
import {
  assertValidAppName,
  collectUsedPorts,
  copySharedPublicAssets,
  createProjectConfiguration,
  renderNextSteps,
  resolvePort,
  toTitle,
  validateSiteId,
  warnOnOverlappingNames,
} from './utils';

export default async function appGenerator(
  tree: Tree,
  options: AppGeneratorSchema,
) {
  const name = (options.name ?? '').trim();
  assertValidAppName(name);

  const projects = getProjects(tree);
  const existingProject = projects.get(name);
  if (existingProject) {
    throw new Error(
      `Project "${name}" already exists at ${existingProject.root}.`,
    );
  }

  const appRoot = `apps/${name}`;
  if (tree.exists(appRoot)) {
    throw new Error(`Folder ${appRoot} already exists.`);
  }

  const e2e = options.e2e ?? true;
  const e2eRoot = `apps/e2e/${name}-e2e`;
  if (e2e && tree.exists(e2eRoot)) {
    throw new Error(`E2E project folder ${e2eRoot} already exists.`);
  }

  const netlifySiteId = validateSiteId(options.netlifySiteId);
  const port = resolvePort(options.port, collectUsedPorts(tree, projects));
  warnOnOverlappingNames(name, Array.from(projects.keys()));

  addProjectConfiguration(tree, name, createProjectConfiguration(name, port));

  generateFiles(tree, 'libs/shared/tools/src/generators/app/files', appRoot, {
    ...names(name),
    title: toTitle(name),
    port: String(port),
    tmpl: '',
    dot: '.',
  });

  const assetSteps = copySharedPublicAssets(tree, name);

  if (e2e) {
    await playwrightGenerator(tree, { application: name });
  }

  const { manualSteps } = registerApp(tree, { name, netlifySiteId, e2e });

  await formatFiles(tree);

  logger.info(`NX apps/${name} created on port ${port}`);
  logger.info(
    renderNextSteps({
      name,
      port,
      e2e,
      netlifySiteId,
      manualSteps: [...assetSteps, ...manualSteps],
    }),
  );
}
