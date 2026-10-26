import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tsParser from '@typescript-eslint/parser';

/**
 * Dynamically generates languageOptions based on the caller's directory name.
 * @param {string} callerMetaUrl - Pass `import.meta.url` from the local config
 */
export function getLanguageOptions(callerMetaUrl) {
  const filename = fileURLToPath(callerMetaUrl);
  const dirname = path.dirname(filename);
  const projectName = path.basename(dirname);

  return {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: `apps/e2e/${projectName}/tsconfig.json`,
      },
    },
  };
}
