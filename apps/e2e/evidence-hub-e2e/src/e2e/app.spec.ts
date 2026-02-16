import { expect, test } from '@playwright/test';

import { basePage } from '../pages/BasePage';

test.describe('Evidence Hub', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Expect h1 to contain a substring.
    expect(await page.locator('h1').innerText()).toContain(
      'The Financial Wellbeing Evidence Hub',
    );
  });

  test('Home page', async ({ page }) => {
    expect(await page.getByTestId('homepage-heading').innerText()).toContain(
      'Welcome to the Evidence Hub',
    );

    await expect(
      page.getByRole('link', { name: 'Topic Overviews Topic' }),
    ).toHaveAttribute('href', '/en/research-library');

    await expect(
      page.getByRole('link', { name: 'Research Library Research' }),
    ).toHaveAttribute('href', '/en/research-library');

    expect(await page.getByTestId('content-heading').innerText()).toContain(
      'How to use the Evidence Hub',
    );

    expect(
      await page
        .getByTestId('content-section')
        .locator('h3')
        .first()
        .innerText(),
    ).toContain('Supporting Information');

    expect(
      await page
        .getByTestId('content-section')
        .getByTestId('paragraph')
        .first()
        .innerText(),
    ).toContain(
      'We’ve also put together a few pages to explain the content of the Hub further:',
    );

    await expect(
      page.getByRole('link', { name: 'Types of evidence and' }),
    ).toHaveAttribute('href', '/en/research-library/evidence-type');

    await expect(
      page.getByRole('link', { name: 'Definitions' }),
    ).toHaveAttribute('href', '/en/research-library/definitions');

    expect(
      await page
        .getByTestId('content-section')
        .locator('h3')
        .last()
        .innerText(),
    ).toContain('Contact us');

    await expect(
      page.getByRole('link', { name: 'what.works@maps.org.uk' }),
    ).toHaveAttribute('href', 'mailto:what.works@maps.org.uk');
  });

  test('Research Library', async ({ page }) => {
    test.setTimeout(1000 * 90);

    await basePage.clickLink(page, 'Research Library Research');
    // Waiting for json to load
    // eslint-disable-next-line playwright/no-networkidle
    await page.waitForLoadState('networkidle');

    await page.waitForURL('**/en/research-library', { timeout: 5000 });
    expect(await page.locator('h1').innerText()).toContain('Research Library');

    await expect(
      page
        .getByTestId('document-list-form-desktop')
        .getByText('documents found'),
    ).toBeVisible();

    let results = await page
      .getByTestId('information-callout')
      .filter({ has: page.locator(':visible') })
      .count();
    expect(results).toBeLessThanOrEqual(10);

    const resultsPerPage = page
      .getByTestId('document-list-form-desktop')
      .getByLabel('Select items per page');
    await expect(resultsPerPage).toMatchAriaSnapshot(`
      - combobox "Select items per page":
        - option "10 per page" [selected]
        - option "20 per page"
        - option "30 per page"
        - option "40 per page"
        - option "50 per page"
    `);

    await resultsPerPage.selectOption('20 per page');
    const searchButton = page
      .getByTestId('document-list-form-desktop')
      .getByRole('button', { name: 'Search' });

    await basePage.waitForPageLoad(page, '**/en/research-library?limit=20');
    expect(await page.locator('h1').innerText()).toContain('Research Library');

    results = await page
      .getByTestId('information-callout')
      .filter({ has: page.locator(':visible') })
      .count();
    expect(results).toBeLessThanOrEqual(20);

    const sortResults = page
      .getByTestId('document-list-form-desktop')
      .getByLabel('Sort results by');
    await expect(sortResults).toMatchAriaSnapshot(`
      - combobox "Sort results by":
        - option "Published Date" [selected]
        - option "Recently Uploaded"
    `);
    await sortResults.selectOption('Recently Uploaded');
    await basePage.waitForPageLoad(
      page,
      '**/en/research-library?**order=updated**',
    );

    await resultsPerPage.selectOption('10 per page');
    await basePage.waitForPageLoad(page, '**/en/research-library?**limit=10**');
    expect(await page.locator('h1').innerText()).toContain('Research Library');

    results = await page
      .getByTestId('information-callout')
      .filter({ has: page.locator(':visible') })
      .count();
    expect(results).toBeLessThanOrEqual(10);

    await basePage.fillInput(page, 'keyword', '360');
    await searchButton.click();

    await basePage.waitForPageLoad(page, '**/en/research-library?**');
    expect(await page.locator('h1').innerText()).toContain('Research Library');

    results = await page
      .getByTestId('information-callout')
      .filter({ has: page.locator(':visible') })
      .count();
    expect(results > 0).toBe(true);

    await basePage.clearInput(page, 'keyword');
    await basePage.selectFilter(page, 'Evidence Type', ['insight']);
    await basePage.selectFilter(page, 'Country', ['england']);
    await searchButton.click();

    await basePage.waitForPageLoad(page, '**/en/research-library?**');
    expect(await page.locator('h1').innerText()).toContain('Research Library');

    results = await page
      .getByTestId('information-callout')
      .filter({ has: page.locator(':visible') })
      .count();
    expect(results > 0).toBe(true);

    await basePage.selectFilter(page, 'Organisation', [
      'MaPS supported',
      'MaPS lead',
    ]);
    await basePage.selectFilter(page, 'Population groups', [
      'Children and young people (18 and under)',
    ]);
    await basePage.selectFilter(page, 'Topics', ['Saving']);
    await searchButton.click();

    await basePage.waitForPageLoad(page, '**/en/research-library?**');
    expect(await page.locator('h1').innerText()).toContain('Research Library');
  });
});
