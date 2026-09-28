import { updatePage as updatePageData } from '@data/updatePage.data';

import LandingPage from './landing.page';

export default class UpdatePage extends LandingPage {
  get currentGuidanceHeading() {
    return this.page.getByTestId(updatePageData.guidanceTitleTestId);
  }

  get mostRecentUpdateLink() {
    return this.page
      .getByRole('heading', { name: updatePageData.currentGuidance })
      .locator('xpath=following::a[1]');
  }
}
