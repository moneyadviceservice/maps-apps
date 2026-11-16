import { framework as frameworkData } from '@data/framework.data';

import LandingPage from './landing.page';

export default class FrameworkPage extends LandingPage {
  get heading() {
    return this.page.getByTestId(frameworkData.headingTestId);
  }

  get backToTop() {
    return this.page.getByTestId(frameworkData.backToTopTestId);
  }
}
