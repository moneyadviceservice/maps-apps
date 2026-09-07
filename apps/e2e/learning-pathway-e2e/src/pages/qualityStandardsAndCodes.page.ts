import { qualityStandardsAndCodesPage as qualityStandardsAndCodesData } from 'src/data/qualityStandardsAndCodes.data';

import LandingPage from './landing.page';

export default class QualityStandardsAndCodesPage extends LandingPage {
  get heading() {
    return this.page.getByTestId(qualityStandardsAndCodesData.headingTestId);
  }
}
