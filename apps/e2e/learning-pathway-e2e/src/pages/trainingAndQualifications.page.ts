import { trainingAndQualificationsPage as trainingAndQualificationsData } from 'src/data/trainingAndQualifications.data';

import LandingPage from './landing.page';

export default class TrainingAndQualificationsPage extends LandingPage {
  get heading() {
    return this.page.getByTestId(trainingAndQualificationsData.headingTestId);
  }
}
