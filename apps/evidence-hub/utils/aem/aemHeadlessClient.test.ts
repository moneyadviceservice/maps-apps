import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import {
  aemHeadlessClient,
  DOCUMENTS_QUERY_NAME,
  isMockAem,
} from './aemHeadlessClient';

jest.mock('@maps-react/utils/aemHeadlessClient', () => ({
  aemHeadlessClient: {
    runPersistedQuery: jest.fn(),
  },
}));

describe('aemHeadlessClient', () => {
  const originalCi = process.env.CI;
  const originalCwd = process.cwd();

  afterEach(() => {
    process.env.CI = originalCi;
    process.chdir(originalCwd);
    jest.clearAllMocks();
  });

  describe('isMockAem', () => {
    it('returns true when CI=true', () => {
      process.env.CI = 'true';
      expect(isMockAem()).toBe(true);
    });

    it('returns false when CI is not set', () => {
      delete process.env.CI;
      expect(isMockAem()).toBe(false);
    });

    it('returns false when CI is not "true"', () => {
      process.env.CI = 'false';
      expect(isMockAem()).toBe(false);
    });
  });

  describe('runPersistedQuery', () => {
    it('delegates to base client when CI is not set', async () => {
      delete process.env.CI;
      const { aemHeadlessClient: baseClient } = jest.requireMock(
        '@maps-react/utils/aemHeadlessClient',
      );
      baseClient.runPersistedQuery.mockResolvedValue({
        data: { pageSectionTemplateList: { items: [] } },
      });

      await aemHeadlessClient.runPersistedQuery(DOCUMENTS_QUERY_NAME);

      expect(baseClient.runPersistedQuery).toHaveBeenCalledWith(
        DOCUMENTS_QUERY_NAME,
        undefined,
      );
    });

    it('throws when the documents fixture file is missing', async () => {
      process.env.CI = 'true';
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'eh-fixtures-'));
      const fixturesDir = path.join(tempDir, 'fixtures', 'e2e');
      fs.mkdirSync(fixturesDir, { recursive: true });
      process.chdir(tempDir);

      await expect(
        aemHeadlessClient.runPersistedQuery(DOCUMENTS_QUERY_NAME),
      ).rejects.toThrow(/E2E fixture not found/);
    });

    it('throws when the documents fixture is not a JSON array', async () => {
      process.env.CI = 'true';
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'eh-fixtures-'));
      const fixturesDir = path.join(tempDir, 'fixtures', 'e2e');
      fs.mkdirSync(fixturesDir, { recursive: true });
      fs.writeFileSync(
        path.join(fixturesDir, 'documents.json'),
        JSON.stringify({ slug: 'not-an-array' }),
      );
      process.chdir(tempDir);

      await expect(
        aemHeadlessClient.runPersistedQuery(DOCUMENTS_QUERY_NAME),
      ).rejects.toThrow(/E2E fixture must be a JSON array/);
    });
    it('returns fixture documents when CI=true and query matches', async () => {
      process.env.CI = 'true';

      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'eh-fixtures-'));
      const fixturesDir = path.join(tempDir, 'fixtures', 'e2e');
      fs.mkdirSync(fixturesDir, { recursive: true });
      fs.writeFileSync(
        path.join(fixturesDir, 'documents.json'),
        JSON.stringify([{ slug: 'mock-doc', title: 'Mock document' }]),
      );
      process.chdir(tempDir);

      const response = await aemHeadlessClient.runPersistedQuery(
        DOCUMENTS_QUERY_NAME,
      );

      expect(response.data.pageSectionTemplateList.items).toEqual([
        { slug: 'mock-doc', title: 'Mock document' },
      ]);
    });

    it('delegates to base client for non-document queries when CI=true', async () => {
      process.env.CI = 'true';
      const { aemHeadlessClient: baseClient } = jest.requireMock(
        '@maps-react/utils/aemHeadlessClient',
      );
      baseClient.runPersistedQuery.mockResolvedValue({ data: { item: {} } });

      await aemHeadlessClient.runPersistedQuery(
        'evidence-hub/site-settings-en',
      );

      expect(baseClient.runPersistedQuery).toHaveBeenCalledWith(
        'evidence-hub/site-settings-en',
        undefined,
      );
    });
  });
});
