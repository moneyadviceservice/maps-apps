import { startPage as startPageData } from '@data/startPage.data';
import { unlockDeployPreviewIfNeeded } from '@utils/deploy-preview.util';

import type { Page } from '../lib/test.lib';

export class LearningHubStartPage {
  constructor(protected readonly page: Page) {}

  async startLearningHub(): Promise<void> {
    await this.page.goto('/');
    await unlockDeployPreviewIfNeeded(this.page);
  }

  async goToNonExistentPage(): Promise<void> {
    await this.page.goto(startPageData.nonExistentPageRoute);
    await unlockDeployPreviewIfNeeded(this.page);
  }

  get welshLanguageLink() {
    return this.page.getByRole('link', { name: /Cymraeg|Welsh/i });
  }

  get titleBanner() {
    return this.page.getByTestId('title-banner-text');
  }

  get learningPathwayLink() {
    return this.page.getByRole('link', { name: 'Learning pathway' });
  }

  get learningPathwayHubLink() {
    return this.page.getByRole('link', { name: 'Learning pathway hub' });
  }

  get errorPageHeading() {
    return this.page.getByRole('heading', {
      name: startPageData.errorPageHeading,
    });
  }

  get errorPageWhatYouCanDoHeading() {
    return this.page.getByRole('heading', {
      level: 2,
      name: startPageData.errorPageWhatYouCanDoHeading,
    });
  }

  get errorPageHomepageLink() {
    return this.page.getByRole('link', {
      name: startPageData.errorPageHomepageLinkText,
    });
  }

  get errorPageHubLink() {
    return this.page.getByRole('link', {
      name: startPageData.errorPageHubLinkText,
    });
  }

  get errorPageSearchText() {
    return this.page.getByText(startPageData.errorPageSearchText);
  }

  async switchToWelsh(): Promise<void> {
    await this.page.getByRole('link', { name: /Cymraeg/ }).click();
  }

  async switchToEnglish(): Promise<void> {
    await this.page.getByRole('link', { name: /English/ }).click();
  }

  async clickLearningPathway(): Promise<void> {
    await this.learningPathwayLink.click();
  }

  async clickLearningPathwayHub(): Promise<void> {
    await this.learningPathwayHubLink.click();
  }
}
