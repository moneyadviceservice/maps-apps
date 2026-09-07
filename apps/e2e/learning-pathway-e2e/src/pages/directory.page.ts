import { directoryPage as directoryPageData } from 'src/data/directoryPage.data';

import { unlockDeployPreviewIfNeeded } from '../lib/deployPreview.lib';
import { subHeading } from '../lib/shared.locators';
import { expect, type Locator, type Page } from '../lib/test.lib';

export class LearningHubDirectoryPage {
  constructor(private readonly page: Page) {}

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  async waitForPageLoad(isMobileView = false): Promise<void> {
    const container = isMobileView
      ? this.page.getByTestId('filter-list-mobile')
      : this.page.getByTestId('filter-list-desktop');
    await container
      .locator('text=' + String.raw`/\d+\s+documents?\s+found/i`)
      .first()
      .waitFor({ state: 'visible', timeout: 15_000 });
  }

  async waitForResultsToUpdate(): Promise<void> {
    // Wait for result cards to be visible, ensuring results have updated
    // Use generous timeout for slow pipeline environments
    await this.resultCards()
      .first()
      .waitFor({ state: 'visible', timeout: 15_000 });
  }

  async navigateToZeroResultsScenario(): Promise<void> {
    await this.page.goto(
      '/en/learning-pathway?debt-activity=initial-contact%2Csupervision-including-technical-learning&type-of-learning=Qualification&channel-of-learning=Online&country=wales',
      { waitUntil: 'load' },
    );
    await unlockDeployPreviewIfNeeded(this.page);
    await this.waitForPageLoad();
  }

  // ---------------------------------------------------------------------------
  // Results
  // ---------------------------------------------------------------------------

  getForm(isMobileView?: boolean): Locator {
    if (isMobileView) return this.page.getByTestId('filter-list-mobile');
    return this.page.getByTestId('filter-list-desktop');
  }

  resultsCount(): Locator {
    return this.page
      .locator('text=' + String.raw`/\d+\s+documents?\s+found/i`)
      .first();
  }

  resultCards(isMobileView?: boolean): Locator {
    return this.getForm(isMobileView).getByTestId(/^document-card-/);
  }

  async getResultCount(): Promise<number> {
    // Wait for the element to be stable to avoid reading stale text
    await this.resultsCount().waitFor({ state: 'visible', timeout: 5_000 });
    const text = await this.resultsCount().innerText();
    const match = /\d+/.exec(text);
    return match ? Number.parseInt(match[0]) : 0;
  }

  async getResultCardCount(isMobileView = false): Promise<number> {
    // Count actual visible result cards instead of relying on text
    return await this.resultCards(isMobileView).count();
  }

  async waitForCardCountToStabilize(isMobileView = false): Promise<void> {
    // Wait for all result cards to be visible and stable
    // First, wait for at least one card to be visible
    // Use generous timeout for slow pipeline environments
    await this.resultCards(isMobileView)
      .first()
      .waitFor({ state: 'visible', timeout: 15_000 });

    // Then wait for them to finish rendering by checking count multiple times.
    // Two consecutive reads are only meaningful if real time separates them —
    // otherwise the old (pre-navigation) count can look "stable" before the
    // new data has even arrived.
    let lastCount = -1;
    for (let i = 0; i < 15; i++) {
      const currentCount = await this.resultCards(isMobileView).count();
      if (currentCount === lastCount && currentCount > 0) {
        return; // Count stable and > 0
      }
      lastCount = currentCount;
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  async waitForCardCountToChange(
    previousCount: number,
    isMobileView = false,
  ): Promise<void> {
    // Wait for card count to actually change from the previous value
    // This ensures new data has been loaded (not just first card is visible)
    let attempts = 0;
    const maxAttempts = 20;

    while (attempts < maxAttempts) {
      const currentCount = await this.resultCards(isMobileView).count();
      if (currentCount !== previousCount) {
        return; // Count has changed, data is new
      }

      // Small delay before retry
      await this.resultCards(isMobileView)
        .first()
        .waitFor({ state: 'visible', timeout: 1_000 })
        .catch(() => {
          // Ignore timeout
        });
      attempts += 1;
    }
  }

  keywordInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Keyword search' });
  }

  searchButton(): Locator {
    return this.page.locator('[name="search"]').first();
  }

  async searchKeyword(keyword: string): Promise<void> {
    const input = this.keywordInput();
    // Clear any existing text first — clear() itself performs the full
    // actionability wait (attached, visible, stable, scrolled into view)
    // with the configured action timeout, so it survives a filter-apply
    // triggering a brief DOM swap of the form
    await input.clear();
    // Type the keyword
    await input.pressSequentially(keyword, { delay: 50 });
    // Click search button
    const urlBefore = this.page.url();
    await this.searchButton().click();
    await this.page
      .waitForURL((url) => url.toString() !== urlBefore, { timeout: 15000 })
      .catch(() => {
        // URL might not change in some edge cases (e.g. no-op search click)
      });
    await this.waitForPageLoad();
  }

  async clearKeyword(): Promise<void> {
    const urlBefore = this.page.url();
    await this.keywordInput().clear();
    await this.searchButton().click();
    await this.page
      .waitForURL((url) => url.toString() !== urlBefore, { timeout: 15000 })
      .catch(() => {
        // URL might not change in some edge cases
      });
    await this.waitForPageLoad();
  }

  // ---------------------------------------------------------------------------
  // Filters — controls
  // ---------------------------------------------------------------------------

  clearAllFiltersLink(): Locator {
    return this.page.getByRole('link', { name: /clear all filters/i });
  }

  applyFiltersButton(): Locator {
    return this.page.getByRole('button', { name: /apply filters/i });
  }

  async applyFilters(): Promise<void> {
    const urlBefore = this.page.url();
    await this.applyFiltersButton().click();
    await this.page
      .waitForURL((url) => url.toString() !== urlBefore, { timeout: 15000 })
      .catch(() => {
        // URL might not change in some edge cases (e.g. no-op filter click)
      });
    await this.waitForPageLoad();
    // Extra synchronization: wait for results to actually update
    await this.waitForCardCountToStabilize();
  }

  async clearAllFilters(): Promise<void> {
    const urlBefore = this.page.url();
    await this.clearAllFiltersLink().click();
    await this.page
      .waitForURL((url) => url.toString() !== urlBefore, { timeout: 15000 })
      .catch(() => {
        // URL might not change in some edge cases
      });
    await this.waitForPageLoad();
    await this.waitForCardCountToStabilize();
  }

  // Helper method to find visible label by text
  private getCheckboxLabel(labelText: string, isMobileView?: boolean): Locator {
    // Find label that contains the text and has a checkbox inside
    return this.getForm(isMobileView)
      .locator(`label:has-text("${labelText}"):has(input[type="checkbox"])`)
      .first();
  }

  // Helper method to expand collapsible filter sections
  private async expandSection(
    header: Locator,
    checkbox: Locator,
  ): Promise<void> {
    const details = header.locator('xpath=ancestor::details[1]');

    for (let attempt = 0; attempt < 3; attempt++) {
      const isOpen = await details
        .evaluate((el) => (el as HTMLDetailsElement).open)
        .catch(() => false);
      if (isOpen) break;

      await header.scrollIntoViewIfNeeded();
      await header.click();
    }

    await checkbox.waitFor({ state: 'visible', timeout: 12000 }).catch(() => {
      // Ignore timeout
    });
  }

  // ---------------------------------------------------------------------------
  // Filters — Debt Activity
  // ---------------------------------------------------------------------------

  debtActivityHeader(): Locator {
    return this.page
      .getByTestId('summary-block-title')
      .filter({ hasText: /debt activity/i })
      .first();
  }

  debtActivityCheckbox(
    value:
      | 'Initial contact'
      | 'Support work'
      | 'Advice work'
      | 'Casework or specialist'
      | 'Court representation'
      | 'Supervision including technical learning',
  ): Locator {
    const valueMap: Record<string, string> = {
      'Initial contact': 'initial-contact',
      'Support work': 'support-work',
      'Advice work': 'advice-work',
      'Casework or specialist': 'casework-or-specialist',
      'Court representation': 'court-representation',
      'Supervision including technical learning':
        'supervision-including-technical-learning',
    };
    return this.page
      .locator(`input[name="debt-activity"][value="${valueMap[value]}"]`)
      .first();
  }

  async selectDebtActivity(
    value: Parameters<typeof this.debtActivityCheckbox>[0],
  ): Promise<void> {
    // Debt Activity section is already expanded by default on page load
    // click() performs the full actionability wait (attached, visible,
    // stable, scrolled into view) with the configured action timeout, so
    // it survives the filter list re-rendering after a prior applyFilters()
    await this.getCheckboxLabel(value).click();
  }

  // ---------------------------------------------------------------------------
  // Filters — Type of Learning
  // ---------------------------------------------------------------------------

  typeOfLearningHeader(): Locator {
    return this.page
      .getByTestId('summary-block-title')
      .filter({ hasText: /type of learning/i })
      .first();
  }

  typeOfLearningCheckbox(value: 'Qualification' | 'Training'): Locator {
    const valueMap: Record<string, string> = {
      Qualification: 'qualification',
      Training: 'training',
    };
    return this.page
      .locator(`input[name="type-of-learning"][value="${valueMap[value]}"]`)
      .first();
  }

  async expandTypeOfLearning(): Promise<void> {
    await this.expandSection(
      this.typeOfLearningHeader(),
      this.typeOfLearningCheckbox('Qualification'),
    );
  }

  async selectTypeOfLearning(
    value: Parameters<typeof this.typeOfLearningCheckbox>[0],
  ): Promise<void> {
    await this.expandTypeOfLearning();
    // click() performs the full actionability wait (attached, visible,
    // stable, scrolled into view) with the configured action timeout, so
    // it survives the filter list re-rendering after a prior applyFilters()
    await this.getCheckboxLabel(value).click();
  }

  // ---------------------------------------------------------------------------
  // Filters — Channel of Learning
  // ---------------------------------------------------------------------------

  channelOfLearningHeader(): Locator {
    return this.page
      .getByTestId('summary-block-title')
      .filter({ hasText: /channel of learning/i })
      .first();
  }

  channelOfLearningCheckbox(
    value: 'Online' | 'Blended learning' | 'Face to face',
  ): Locator {
    const valueMap: Record<string, string> = {
      Online: 'online',
      'Blended learning': 'blended-learning',
      'Face to face': 'face-to-face',
    };
    return this.page
      .locator(`input[name="channel-of-learning"][value="${valueMap[value]}"]`)
      .first();
  }

  async expandChannelOfLearning(): Promise<void> {
    await this.expandSection(
      this.channelOfLearningHeader(),
      this.channelOfLearningCheckbox('Online'),
    );
  }

  async selectChannelOfLearning(
    value: Parameters<typeof this.channelOfLearningCheckbox>[0],
  ): Promise<void> {
    await this.expandChannelOfLearning();
    // click() performs the full actionability wait (attached, visible,
    // stable, scrolled into view) with the configured action timeout, so
    // it survives the filter list re-rendering after a prior applyFilters()
    await this.getCheckboxLabel(value).click();
  }

  // ---------------------------------------------------------------------------
  // Filters — Country
  // ---------------------------------------------------------------------------

  countryHeader(isMobileView?: boolean): Locator {
    return this.getForm(isMobileView)
      .getByTestId('summary-block-title')
      .filter({ hasText: /country/i })
      .first();
  }

  countryCheckbox(value: 'England' | 'Wales'): Locator {
    const valueMap: Record<string, string> = {
      England: 'england',
      Wales: 'wales',
    };
    return this.page
      .locator(`input[name="country"][value="${valueMap[value]}"]`)
      .first();
  }

  async expandCountry(isMobileView?: boolean): Promise<void> {
    await this.expandSection(
      this.countryHeader(isMobileView),
      this.countryCheckbox('England'),
    );
  }

  async selectCountry(
    value: Parameters<typeof this.countryCheckbox>[0],
  ): Promise<void> {
    await this.expandCountry();
    // click() performs the full actionability wait (attached, visible,
    // stable, scrolled into view) with the configured action timeout, so
    // it survives the filter list re-rendering after a prior applyFilters()
    await this.getCheckboxLabel(value).click();
  }

  // ---------------------------------------------------------------------------
  // Sorting
  // ---------------------------------------------------------------------------

  sortDropdown(isMobileView?: boolean): Locator {
    return this.getForm(isMobileView).locator(
      `#${directoryPageData.sortDropdownId}`,
    );
  }

  async selectSortOrder(label: string, isMobileView?: boolean): Promise<void> {
    const urlBefore = this.page.url();
    await this.sortDropdown(isMobileView).selectOption({ label });
    // Sorting doesn't change the result count, so the "N documents found"
    // text can look stable immediately — wait for the URL's order param to
    // actually change before checking the cards, otherwise a stale
    // (pre-sort) card list can read as "stable".
    await this.page
      .waitForURL((url) => url.toString() !== urlBefore, { timeout: 15000 })
      .catch(() => {
        // URL might not change in some edge cases
      });
    await this.waitForPageLoad();
    await this.waitForCardCountToStabilize();
  }

  async getAllCardTitles(isMobileView = false): Promise<string[]> {
    const count = await this.getResultCardCount(isMobileView);
    const titles: string[] = [];
    for (let i = 0; i < count; i++) {
      titles.push(await this.getCardTitle(i, isMobileView));
    }
    return titles;
  }

  async getAllCardDatesLaunched(isMobileView = false): Promise<string[]> {
    const count = await this.getResultCardCount(isMobileView);
    const dates: string[] = [];
    for (let i = 0; i < count; i++) {
      dates.push(await this.getCardDateLaunched(i, isMobileView));
    }
    return dates;
  }

  // ---------------------------------------------------------------------------
  // Assertions
  // ---------------------------------------------------------------------------

  async assertNoResults(): Promise<void> {
    await expect(
      this.page.getByText(/0 documents? found|no results/i).first(),
    ).toBeVisible();
  }

  async assertAtLeastOneCardContainsText(text: string): Promise<void> {
    // Avoid nth(i).innerText() loops — Next 16 soft-nav remounts cards mid-scan.
    const matchingCard = this.resultCards().filter({ hasText: text });
    await expect(
      matchingCard.first(),
      `No card found containing "${text}"`,
    ).toBeVisible({ timeout: 15_000 });
  }

  async assertAllCardsContainAtLeastOne(values: string[]): Promise<void> {
    const cards = this.resultCards();
    await cards.first().waitFor({ state: 'visible', timeout: 15_000 });
    // Snapshot all card text in one read. Looping nth(i).innerText() hangs
    // when Next 16 soft-nav remounts the list mid-scan.
    const texts = await cards.allInnerTexts();
    expect(texts.length).toBeGreaterThan(0);
    for (let i = 0; i < texts.length; i++) {
      const cardText = texts[i];
      const matchesAny = values.some((v) =>
        cardText.toLowerCase().includes(v.toLowerCase()),
      );
      expect(
        matchesAny,
        `Card ${i + 1} did not match any of: ${values.join(', ')}`,
      ).toBe(true);
    }
  }

  async assertResultsCountVisible(): Promise<void> {
    await expect(this.resultsCount()).toBeVisible();
  }

  async assertFilterCheckboxVisible(label: string): Promise<void> {
    // Find checkbox by its associated label (text is in label, not input)
    // For sr-only checkboxes, verify they exist and are enabled, not visible
    const checkbox = this.page.locator(
      `label:has-text("${label}") input[type="checkbox"]`,
    );
    await expect(checkbox).not.toHaveCount(0);
    // Verify at least the first matching checkbox is enabled
    await expect(checkbox.first()).toBeEnabled();
  }

  async assertClearAllFiltersVisible(): Promise<void> {
    await expect(this.clearAllFiltersLink()).toBeVisible();
  }

  async assertApplyFiltersVisible(): Promise<void> {
    await expect(this.applyFiltersButton()).toBeVisible();
  }

  async assertNoResultsMessage(): Promise<void> {
    await expect(
      this.page.getByText(/we're sorry, no results have been found/i).first(),
    ).toBeVisible();
  }

  // ---------------------------------------------------------------------------
  // Card Details - AC1 TEST CASE 1: Card Display Information
  // ---------------------------------------------------------------------------

  getCardByIndex(cardIndex: number, isMobileView?: boolean): Locator {
    return this.resultCards(isMobileView).nth(cardIndex);
  }

  async getCardTitle(
    cardIndex: number,
    isMobileView: boolean,
  ): Promise<string> {
    const card = this.getCardByIndex(cardIndex, isMobileView);
    // Find heading element (h2, h3, or element with heading role)
    return await card.locator('h2, h3, [role="heading"]').first().innerText();
  }

  getCardViewDocumentLink(cardIndex: number, isMobileView = false): Locator {
    return this.getCardByIndex(cardIndex, isMobileView).getByRole('link', {
      name: /view document/i,
    });
  }

  getCardBySlug(slug: string, isMobileView = false): Locator {
    return this.getForm(isMobileView).getByTestId(`document-card-${slug}`);
  }

  getCardViewDocumentLinkBySlug(slug: string, isMobileView = false): Locator {
    return this.getCardBySlug(slug, isMobileView).getByRole('link', {
      name: /view document/i,
    });
  }

  async getCardDateLaunched(
    cardIndex: number,
    isMobileView = false,
  ): Promise<string> {
    const card = this.getCardByIndex(cardIndex, isMobileView);
    // Find the span with "Date Launched" label
    const dateLabel = card
      .locator('span.font-bold, div.font-bold')
      .filter({ hasText: /Date Launched/i })
      .first();
    // Get parent container and extract the date value
    const parent = dateLabel.locator('..');
    const fullText = await parent.innerText();
    // Extract date value in DD/MM/YYYY format (allowing 1-2 digits for day/month)
    const dateMatch = /\d{1,2}\/\d{1,2}\/\d{4}/.exec(fullText);
    return dateMatch ? dateMatch[0] : '';
  }

  async getCardOwner(cardIndex: number, isMobileView = false): Promise<string> {
    const card = this.getCardByIndex(cardIndex, isMobileView);
    // Find the label containing "Owner" (div.font-bold) and extract the organization name
    const ownerLabel = card
      .locator('div.font-bold')
      .filter({ hasText: /Owner/i })
      .first();
    const parent = ownerLabel.locator('..');
    const fullText = await parent.innerText();
    // Extract the organization name part after "Owner: "
    const ownerMatch = /Owner\s*:\s*(.+)/i.exec(fullText);
    return ownerMatch ? ownerMatch[1].trim() : '';
  }

  async getCardDescription(cardIndex: number): Promise<string> {
    const card = this.getCardByIndex(cardIndex);
    // Description is typically in a paragraph element after the metadata
    return await card
      .locator('p')
      .filter({ hasNot: card.locator('strong, em') })
      .first()
      .innerText();
  }

  async getCardMetadata(
    cardIndex: number,
    isMobileView = false,
  ): Promise<string[]> {
    const card = this.getCardByIndex(cardIndex, isMobileView);
    // Metadata is typically in list items or divs at the bottom of card
    // Get all text content from metadata section
    const metadata = await card
      .locator('ul li, [data-testid*="metadata"]')
      .allInnerTexts();
    return metadata.filter((text) => text.trim().length > 0);
  }

  async assertCardHasAllElements(
    cardIndex: number,
    isMobileView: boolean,
  ): Promise<void> {
    const card = this.getCardByIndex(cardIndex, isMobileView);

    // Assert title/heading exists
    await expect(
      card.locator('h2, h3, [role="heading"]').first(),
    ).toBeVisible();

    // Assert "View document" link exists
    await expect(
      card.getByRole('link', { name: /view document/i }).first(),
    ).toBeVisible();

    // Assert "Date Launched" exists with valid date format (DD/MM/YYYY)
    const dateLaunched = await this.getCardDateLaunched(
      cardIndex,
      isMobileView,
    );
    expect(dateLaunched).toMatch(/^\d{1,2}\/\d{1,2}\/\d{4}$/);

    // Assert "Owner" exists with actual organization name value
    const owner = await this.getCardOwner(cardIndex, isMobileView);
    expect(owner.length).toBeGreaterThan(0);

    // Assert description exists (paragraph)
    const descriptionElement = card.locator('p').first();
    await expect(descriptionElement).toHaveCount(1);
    const descriptionText = await descriptionElement.innerText();
    expect(descriptionText.length).toBeGreaterThan(0);

    // Assert metadata exists and contains expected column types
    const metadataText = await card
      .locator('ul li, [data-testid*="metadata"]')
      .allInnerTexts();
    const metadataString = metadataText.join(' ');
    // Metadata should contain actual values from at least one category
    // (Debt activity values: Initial contact, Support work, Advice work, Casework or specialist, Supervision, Court representation
    //  Type of learning values: Qualification, Training
    //  Channel of learning values: Online, Face to face, Blended learning
    //  Country values: England, Wales)
    const hasValidMetadataValues =
      metadataString.length > 0 &&
      /initial contact|support work|advice work|casework|supervision|court representation|qualification|training|online|face to face|blended learning|england|wales/i.test(
        metadataString,
      );
    expect(
      hasValidMetadataValues,
      `Metadata should contain valid column values. Got: "${metadataString}"`,
    ).toBe(true);
  }

  async assertFirstNCardsHaveAllElements(
    maxCards = 0,
    isMobileView = false,
  ): Promise<void> {
    // Check up to maxCards cards have all required elements
    // Default (0) checks ALL visible cards, pass a number to limit checks (e.g., 3 for first 3)
    const cardCount = await this.getResultCardCount(isMobileView);
    const cardsToCheck =
      maxCards <= 0 ? cardCount : Math.min(cardCount, maxCards);

    for (let i = 0; i < cardsToCheck; i++) {
      await this.assertCardHasAllElements(i, isMobileView);
      const title = await this.getCardTitle(i, isMobileView);
      expect(title.length).toBeGreaterThan(0);
    }
  }

  // ---------------------------------------------------------------------------
  // View Document destination checks
  // ---------------------------------------------------------------------------

  async clickViewDocument(cardIndex = 0): Promise<void> {
    const link = this.getCardViewDocumentLink(cardIndex);
    await link.click();
  }

  async clickViewDocumentBySlug(slug: string): Promise<void> {
    await this.getCardViewDocumentLinkBySlug(slug).click();
  }

  subHeading(text: string, level = 2): Locator {
    return subHeading(this.page, text, level);
  }

  get descriptionHeading(): Locator {
    return this.page.getByTestId(directoryPageData.descriptionHeadingTestId);
  }

  get keyInfoHeading(): Locator {
    return this.page.getByTestId(directoryPageData.keyInfoHeadingTestId);
  }
}
