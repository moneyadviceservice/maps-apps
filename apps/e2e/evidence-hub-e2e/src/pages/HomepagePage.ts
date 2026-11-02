import { expect, type Locator, type Page } from '@playwright/test';

import { teaserCardAccessibleLinkName } from '../data/homepageTeaser.data';
import { BasePage } from './BasePage';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

function externalTeaserLinkNamePattern(visibleTitle: string): RegExp {
  return new RegExp(
    String.raw`^${escapeRegExp(visibleTitle)} \(opens in a new window\)$`,
    'i',
  );
}

export class HomepagePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /** Navigate to the Evidence Hub homepage and dismiss the cookie banner. */
  async gotoHome(): Promise<void> {
    await this.goto('/');
  }

  /** Assert the main hub title is visible in the page heading. */
  async expectHubTitleVisible(): Promise<void> {
    await expect(this.page.locator('h1')).toContainText(
      'The Financial Wellbeing Evidence Hub',
    );
  }

  cardsSection(): Locator {
    return this.page.getByTestId('cards-section');
  }

  teaserCards(): Locator {
    return this.cardsSection().getByTestId('teaserCard');
  }

  getTeaserCardLink(title: string, opensInNewWindow = false): Locator {
    return this.teaserCards().getByRole('link', {
      name: teaserCardAccessibleLinkName(title, opensInNewWindow),
    });
  }

  async expectTeaserCardsVisible(): Promise<void> {
    await expect(this.cardsSection()).toBeVisible();
    await expect(this.teaserCards().first()).toBeVisible();
    expect(await this.teaserCards().count()).toBeGreaterThan(0);
  }

  /** Assert core homepage content loaded from live AEM. */
  async expectCoreContentFromAem(): Promise<void> {
    await expect(this.page.getByTestId('homepage-heading')).toContainText(
      'Welcome to the Evidence Hub',
    );

    await expect(
      this.page.getByRole('link', { name: 'Topic Overviews' }),
    ).toHaveAttribute('href');

    await expect(
      this.page.getByRole('link', { name: 'Research Library' }),
    ).toHaveAttribute('href');

    await expect(this.page.getByTestId('content-heading')).toContainText(
      'How to use the Evidence Hub',
    );

    await expect(
      this.page.getByTestId('content-section').locator('h3').first(),
    ).toContainText('Supporting Information');

    await expect(
      this.page.getByTestId('content-section').getByTestId('paragraph').first(),
    ).toContainText(
      'We’ve also put together a few pages to explain the content of the Hub further:',
    );

    await expect(
      this.page.getByRole('link', { name: 'Types of evidence and' }),
    ).toHaveAttribute('href', '/en/research-library/evidence-type');

    await expect(
      this.page.getByRole('link', { name: 'Definitions' }),
    ).toHaveAttribute('href', '/en/research-library/definitions');

    await expect(
      this.page.getByTestId('content-section').locator('h3').last(),
    ).toContainText('Contact us');

    await expect(
      this.page.getByRole('link', { name: 'what.works@maps.org.uk' }),
    ).toHaveAttribute('href', 'mailto:what.works@maps.org.uk');
  }

  teaserCardLink(card: Locator): Locator {
    return card.getByRole('link').first();
  }

  teaserCardDescription(card: Locator): Locator {
    return card.locator('p').first();
  }

  async getVisibleLinkTitle(link: Locator): Promise<string> {
    return link.evaluate((element) => {
      const clone = element.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('.sr-only').forEach((node) => node.remove());
      return clone.textContent?.trim() ?? '';
    });
  }

  async expectDescriptionOutsideLink(card: Locator): Promise<void> {
    const link = this.teaserCardLink(card);
    const description = this.teaserCardDescription(card);

    await expect(description).toBeVisible();
    await expect(link).toBeVisible();

    const descriptionInsideLink = await card.evaluate((cardElement) => {
      const anchor = cardElement.querySelector('a');
      const paragraph = cardElement.querySelector('p');
      return Boolean(anchor && paragraph && anchor.contains(paragraph));
    });

    expect(descriptionInsideLink).toBe(false);
  }

  async expectLinkNamedByVisibleTitle(card: Locator): Promise<void> {
    const link = this.teaserCardLink(card);
    const visibleTitle = await this.getVisibleLinkTitle(link);

    expect(visibleTitle.length).toBeGreaterThan(0);

    const opensInNewWindow = (await link.getAttribute('target')) === '_blank';

    if (opensInNewWindow) {
      await expect(link).toHaveAccessibleName(
        externalTeaserLinkNamePattern(visibleTitle),
      );
      return;
    }

    await expect(link).toHaveAccessibleName(visibleTitle);
  }

  /** Assert every teaser card has an accessible title link and description. */
  async expectAllTeaserCardsAccessible(): Promise<void> {
    await this.expectTeaserCardsVisible();

    const cardCount = await this.teaserCards().count();

    for (let index = 0; index < cardCount; index++) {
      const card = this.teaserCards().nth(index);
      const link = this.teaserCardLink(card);
      const visibleTitle = await this.getVisibleLinkTitle(link);
      const opensInNewWindow = (await link.getAttribute('target')) === '_blank';

      await expect(card.locator('h3')).toBeVisible();
      await expect(
        this.getTeaserCardLink(visibleTitle, opensInNewWindow),
      ).toBeVisible();
      await this.expectDescriptionOutsideLink(card);
      await this.expectLinkNamedByVisibleTitle(card);

      const image = card.locator('img');
      if ((await image.count()) > 0) {
        await expect(image).toHaveAttribute('alt', '');
      }
    }
  }

  async focusFirstTeaserLink(): Promise<Locator> {
    const link = this.teaserCards().first().getByRole('link').first();
    await link.focus();
    return link;
  }

  async expectExternalLinksAnnounceNewWindow(): Promise<void> {
    const externalLinks = this.cardsSection().locator('a[target="_blank"]');
    const count = await externalLinks.count();

    for (let index = 0; index < count; index++) {
      const link = externalLinks.nth(index);
      await expect(link).toHaveAccessibleName(/opens in a new window/i);
    }
  }

  async expectInternalLinksDoNotAnnounceNewWindow(): Promise<void> {
    const internalLinks = this.cardsSection().locator(
      'a:not([target="_blank"])',
    );
    const count = await internalLinks.count();

    for (let index = 0; index < count; index++) {
      const link = internalLinks.nth(index);
      const accessibleName =
        (await link.getAttribute('aria-label')) ??
        (await link.evaluate((element) => {
          const clone = element.cloneNode(true) as HTMLElement;
          clone.querySelectorAll('.sr-only').forEach((node) => node.remove());
          return clone.textContent?.trim() ?? '';
        }));

      expect(accessibleName).not.toMatch(/opens in a new window/i);
    }
  }
}
