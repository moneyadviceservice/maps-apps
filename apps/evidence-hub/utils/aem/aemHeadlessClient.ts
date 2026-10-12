import * as fs from 'node:fs';
import * as path from 'node:path';

import { aemHeadlessClient as baseAemHeadlessClient } from '@maps-react/utils/aemHeadlessClient';

export const DOCUMENTS_QUERY_NAME = 'evidence-hub/get-documents-en';
export const MOCK_AEM_CACHE_BUILD_ID = 'e2e-mock';

function getFixturesDir(): string {
  const candidates = [
    path.join(process.cwd(), 'fixtures/e2e'),
    path.resolve(__dirname, '../../fixtures/e2e'),
  ];

  return candidates.find((dir) => fs.existsSync(dir)) ?? candidates[0];
}

function fixturePath(filename: string): string {
  return path.join(getFixturesDir(), filename);
}

/** When true, document queries use local fixtures (see evidence-hub-e2e with `CI=true`). */
export function isMockAem(): boolean {
  return process.env.CI === 'true';
}

function loadJsonArrayFromPath<T>(filePath: string): T[] {
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `E2E fixture not found at ${filePath} (cwd=${process.cwd()})`,
    );
  }

  const contents = fs.readFileSync(filePath, 'utf8');
  const parsed: unknown = JSON.parse(contents);

  if (!Array.isArray(parsed)) {
    throw new TypeError(`E2E fixture must be a JSON array: ${filePath}`);
  }

  return parsed as T[];
}

function getMockDocumentsQueryResponse() {
  return {
    data: {
      pageSectionTemplateList: {
        items: loadJsonArrayFromPath(fixturePath('documents.json')),
      },
    },
  };
}

export const aemHeadlessClient = {
  runPersistedQuery: async (
    queryName: string,
    query?: { slug?: string; pageType?: string },
  ) => {
    if (!isMockAem()) {
      return baseAemHeadlessClient.runPersistedQuery(queryName, query);
    }

    if (queryName === DOCUMENTS_QUERY_NAME) {
      return getMockDocumentsQueryResponse();
    }

    return baseAemHeadlessClient.runPersistedQuery(queryName, query);
  },
};
