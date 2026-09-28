import { execCommand } from 'nx/src/command-line/release/utils/exec-command';
import * as fs from 'node:fs';
import { isIgnoredFile } from './build-changes';

type TsPaths = Record<string, string[]>;

/**
 * Extracts the library name and import path from a shared library file path.
 *
 * @param file - The file path to parse (e.g. `libs/shared/ui/src/components/Button/Button.tsx`).
 * @returns The library name and import path, or null if the path does not match the expected pattern.
 */
export function getChangedComponent(file: string) {
  const match = /libs\/shared\/([^/]+)\/src\/(.+)\/[^/]+\.tsx$/.exec(file);

  if (!match) {
    return null;
  }

  const [, library, path] = match;

  return {
    library,
    importPath: path.replace(/\/$/, ''),
  };
}

type ChangedComponent = {
  library: string;
  importPath: string;
};

/**
 * Finds files that directly import a shared component.
 *
 * Searches both apps and libraries because libraries can consume
 * other libraries. Recursive traversal is handled separately by
 * findAffectedApps().
 *
 * @param changedComponent The component to search for.
 * @returns Files that directly import the component.
 */
export async function findConsumers(
  changedComponent: ChangedComponent,
): Promise<string[]> {
  const alias = resolveImportAlias(changedComponent.library);

  if (!alias) {
    return [];
  }

  const importPath = `${alias}/${changedComponent.importPath}`;

  let result = '';

  try {
    result = await execCommand('git', [
      'grep',
      '-l',
      importPath,
      '--',
      'apps',
      'libs',
    ]);
  } catch {
    // git grep exits with code 1 when nothing is found
    return [];
  }

  if (!result.trim()) {
    return [];
  }
  return result
    .split('\n')
    .filter(Boolean)
    .filter((file) => !isIgnoredFile(file));
}

/**
 * Resolves the TypeScript path alias for a shared library.
 *
 * Looks up the library source path in the root tsconfig paths configuration
 * and returns the matching import alias used within the codebase.
 *
 * @param library - The shared library name (for example, "core" or "form").
 * @returns The import alias for the library, or null if no matching alias exists.
 */
export function resolveImportAlias(library: string): string | null {
  const tsconfig = JSON.parse(fs.readFileSync('tsconfig.base.json', 'utf-8'));

  const paths = tsconfig.compilerOptions.paths as TsPaths;

  const entry = Object.entries(paths).find(
    ([alias, pathValues]) =>
      alias.endsWith('/*') &&
      pathValues.some((path) => path.includes(`libs/shared/${library}/src`)),
  );

  if (!entry) {
    return null;
  }

  return entry[0].replace(/\/\*$/, '');
}

/**
 * Resolves all applications affected by a changed shared component.
 *
 * A component can be consumed directly by an app or indirectly through
 * another shared library. This function recursively walks library
 * dependencies until it reaches application consumers.
 *
 * Example:
 *
 * @maps-react/core/Header
 *        ↓
 * @maps-react/layouts/ToolPageLayout
 *        ↓
 * apps/*
 *
 * @param component The changed component to start traversal from.
 * @returns A list of affected application names.
 */
export async function findAffectedApps(
  component: ChangedComponent,
): Promise<string[]> {
  const affectedApps = new Set<string>();
  const visited = new Set<string>();

  async function walk(component: ChangedComponent) {
    const key = `${component.library}/${component.importPath}`;

    if (visited.has(key)) {
      return;
    }

    visited.add(key);

    const consumers = await findConsumers(component);

    for (const consumer of consumers) {
      if (consumer.startsWith('apps/')) {
        const app = consumer.split('/')[1];

        if (app) {
          affectedApps.add(app);
        }
      }

      if (consumer.startsWith('libs/')) {
        const childComponent = getChangedComponent(consumer);

        if (childComponent) {
          await walk(childComponent);
        }
      }
    }
  }

  await walk(component);

  return Array.from(affectedApps).sort((a, b) => a.localeCompare(b));
}
