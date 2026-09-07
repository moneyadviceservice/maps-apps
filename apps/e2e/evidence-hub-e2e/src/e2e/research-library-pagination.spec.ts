/**
 * Research library pagination: changing results per page.
 */
import { expect, test } from '@lib/test.fixture';

import { researchLibraryCiE2eConstants as C } from '../data/researchLibraryCiE2eConstants.data';

test.describe('Research Library pagination', () => {
  test('changes results per page', async ({ researchLibraryPage }) => {
    await researchLibraryPage.goToAllResults();
    await researchLibraryPage.assertHeadingContains('Research Library');
    await researchLibraryPage.assertResultsCount(C.documentCount);

    const resultsPerPage = researchLibraryPage.resultsPerPageSelect();
    await expect(resultsPerPage).toMatchAriaSnapshot(`
      - combobox "Select items per page":
        - option "10 per page"
        - option "20 per page"
        - option "30 per page"
        - option "40 per page"
        - option "50 per page" [selected]
    `);

    await resultsPerPage.selectOption('20 per page');
    await researchLibraryPage.waitForPageLoad(
      '**/en/research-library?limit=20',
    );
    await researchLibraryPage.assertHeadingContains('Research Library');
    await researchLibraryPage.assertResultsCount(C.documentCount);

    await resultsPerPage.selectOption('10 per page');
    await researchLibraryPage.waitForPageLoad(
      '**/en/research-library?**limit=10**',
    );
    await researchLibraryPage.assertHeadingContains('Research Library');
    await researchLibraryPage.assertVisibleResultsCount(10);
  });
});
