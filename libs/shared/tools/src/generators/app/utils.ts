import { logger, ProjectConfiguration, Tree } from '@nx/devkit';

export const NAME_PATTERN = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
export const SITE_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
export const PORT_FLOOR = 4300;

// Copied from the shared lib at generation time so the apps share one source.
export const SHARED_PUBLIC_DIR = 'libs/shared/ui/src/public';
export const SHARED_PUBLIC_ASSETS = [
  'maps-logo.png',
  'maps-logo-cy.svg',
  'icons/apple-touch-icon-180x180.png',
  'icons/favicon-16x16.png',
  'icons/favicon-32x32.png',
  'icons/safari-pinned-tab.svg',
  'footer/gov.svg',
  'footer/gov-cy.svg',
  'footer/wwp-logo.svg',
];

export function assertValidAppName(name: string) {
  if (!NAME_PATTERN.test(name)) {
    throw new Error(
      `Invalid app name "${name}": use kebab-case (lowercase letters, digits, single hyphens), e.g. "example-tool".`,
    );
  }

  if (name === 'e2e' || name.endsWith('-e2e')) {
    throw new Error(
      `Invalid app name "${name}": names ending in "-e2e" are reserved for the e2e projects under apps/e2e.`,
    );
  }
}

export function toTitle(name: string) {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function toJobId(name: string) {
  return name.replace(/-/g, '_');
}

export function validateSiteId(siteId?: string) {
  if (siteId === undefined || siteId === '') {
    return undefined;
  }

  if (!SITE_ID_PATTERN.test(siteId)) {
    throw new Error(
      `Invalid --netlifySiteId "${siteId}": expected a Netlify site id UUID such as f6cbe253-9083-4d34-bd91-b80632080494.`,
    );
  }

  return siteId;
}

export function warnOnOverlappingNames(name: string, projectNames: string[]) {
  const overlapping = projectNames.filter(
    (projectName) =>
      projectName !== name &&
      !projectName.endsWith('-e2e') &&
      (projectName.includes(name) || name.includes(projectName)),
  );

  for (const projectName of overlapping) {
    logger.warn(
      `"${name}" overlaps with the existing project "${projectName}". netlify/templates/test-affected.yml matches app names with contains(), so a deploy of one may also trigger the other's e2e job.`,
    );
  }
}

export function collectUsedPorts(
  tree: Tree,
  projects: Map<string, ProjectConfiguration>,
) {
  const usedPorts = new Map<number, string[]>();
  // One owner per project and port, so a clash message stays readable.
  const addPort = (port: unknown, projectName: string, location: string) => {
    if (typeof port !== 'number') {
      return;
    }
    const owners = usedPorts.get(port) ?? [];
    if (!owners.some((owner) => owner.startsWith(`${projectName} (`))) {
      usedPorts.set(port, [...owners, `${projectName} (${location})`]);
    }
  };

  for (const [projectName, project] of Array.from(projects)) {
    for (const [targetName, target] of Object.entries(project.targets ?? {})) {
      addPort(
        target.options?.port,
        projectName,
        `${project.root}/project.json targets.${targetName}`,
      );
    }
  }

  if (tree.exists('apps')) {
    for (const child of tree.children('apps')) {
      const netlifyTomlPath = `apps/${child}/netlify.toml`;
      if (!tree.isFile(netlifyTomlPath)) {
        continue;
      }
      const targetPort = /^[ \t]*targetPort[ \t]*=[ \t]*(\d+)/m.exec(
        tree.read(netlifyTomlPath, 'utf-8') ?? '',
      );
      if (targetPort) {
        addPort(Number(targetPort[1]), child, netlifyTomlPath);
      }
    }
  }

  return usedPorts;
}

export function pickFreePort(usedPorts: Map<number, string[]>) {
  let port = PORT_FLOOR;
  while (usedPorts.has(port)) {
    port++;
  }
  return port;
}

export function resolvePort(
  requestedPort: number | undefined,
  usedPorts: Map<number, string[]>,
) {
  if (requestedPort === undefined) {
    return pickFreePort(usedPorts);
  }

  if (
    !Number.isInteger(requestedPort) ||
    requestedPort < 1024 ||
    requestedPort > 65535
  ) {
    throw new Error(
      `Invalid --port "${requestedPort}": use an integer between 1024 and 65535.`,
    );
  }

  const owners = usedPorts.get(requestedPort);
  if (owners) {
    throw new Error(
      `Port ${requestedPort} is already used by ${owners.join(
        ', ',
      )}. Pick another --port or omit it to use the next free port.`,
    );
  }

  return requestedPort;
}

export function createProjectConfiguration(
  name: string,
  port: number,
): ProjectConfiguration {
  const root = `apps/${name}`;

  return {
    root,
    sourceRoot: root,
    projectType: 'application',
    tags: [],
    targets: {
      build: {
        executor: '@nx/next:build',
        outputs: ['{options.outputPath}'],
        defaultConfiguration: 'production',
        options: {
          outputPath: `dist/${root}`,
          assets: [
            {
              glob: '**/*',
              input: `${SHARED_PUBLIC_DIR}/footer`,
              output: './footer',
            },
          ],
        },
        configurations: {
          development: {
            outputPath: root,
          },
          production: {},
        },
      },
      serve: {
        executor: '@nx/next:server',
        defaultConfiguration: 'development',
        options: {
          buildTarget: `${name}:build`,
          dev: true,
          port,
        },
        configurations: {
          development: {
            buildTarget: `${name}:build:development`,
            dev: true,
          },
          production: {
            buildTarget: `${name}:build:production`,
            dev: false,
          },
        },
      },
      export: {
        executor: '@nx/next:export',
        options: {
          buildTarget: `${name}:build:production`,
        },
      },
      test: {
        executor: '@nx/jest:jest',
        outputs: ['{workspaceRoot}/coverage/{projectRoot}'],
        options: {
          jestConfig: `${root}/jest.config.ts`,
          collectCoverage: true,
          coverageReporters: ['lcov', 'text'],
        },
      },
      snapshots: {
        executor: '@nx/jest:jest',
        options: {
          jestConfig: `${root}/jest.config.ts`,
          updateSnapshot: true,
        },
      },
      lint: {
        executor: '@nx/eslint:lint',
        outputs: ['{options.outputFile}'],
      },
      typecheck: {
        executor: 'nx:run-commands',
        options: {
          commands: ['tsc -p tsconfig.json --noEmit'],
          cwd: root,
          forwardAllArgs: false,
        },
      },
    },
  };
}

export function copySharedPublicAssets(tree: Tree, name: string) {
  const manualSteps: string[] = [];

  for (const asset of SHARED_PUBLIC_ASSETS) {
    const source = `${SHARED_PUBLIC_DIR}/${asset}`;
    const destination = `apps/${name}/public/${asset}`;
    const content = tree.read(source);

    if (!content) {
      logger.warn(`${source} not found, so ${destination} was not created.`);
      manualSteps.push(
        `Copy ${asset} from another app into apps/${name}/public`,
      );
      continue;
    }

    tree.write(destination, content);
  }

  return manualSteps;
}

export function renderNextSteps({
  name,
  port,
  e2e,
  netlifySiteId,
  manualSteps,
}: {
  name: string;
  port: number;
  e2e: boolean;
  netlifySiteId?: string;
  manualSteps: string[];
}) {
  const steps = [
    'npx nx reset (the project graph has changed)',
    `cp apps/${name}/.env.example apps/${name}/.env.local and fill in the values`,
    `npx nx serve ${name}, then open http://localhost:${port}/en (also /cy and /en?isEmbedded=true)`,
    `Create the Netlify site for "${name}" with base directory apps/${name}, set PROJECT_NAME=${name} on it and add its environment variables`,
  ];

  if (netlifySiteId) {
    steps.push(
      `If the Netlify site is not named "${name}", change NETLIFY_ENV_FILTER in the "${name}" case in netlify/templates/match-site.yml`,
    );
  } else {
    steps.push(
      [
        'Add the Netlify site id to:',
        `     netlify/templates/match-site.yml   a "${name}") case before *) with NETLIFY_SITE_ID, NETLIFY_SITE_FILTER="${name}" and NETLIFY_ENV_FILTER=<netlify site name>`,
        `     netlify/scripts/sites.py           "${name}": "<site id>",`,
        `     netlify/scripts/get-site-id.sh     ["${name}"]="<site id>"`,
      ].join('\n'),
    );
  }

  if (!e2e) {
    steps.push(
      `Add an e2e project later with npx nx g @maps-react/tools:e2e-generate ${name}, then add its job to netlify/templates/test-affected.yml`,
    );
  }

  steps.push(
    'Optional: list the tool in apps/tools-index/data/tools-index-data.ts',
    ...manualSteps,
  );

  return [
    'Next steps:',
    ...steps.map((step, index) => `  ${index + 1}. ${step}`),
    '',
  ].join('\n');
}
