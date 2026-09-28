import { confirmDetailsPage } from 'data/pages/account/firm-details/confirm-details';
import {
  addressLineOneField,
  addressLineTwoField,
  countryField,
  postcodeField,
  principlePlaceOfBusinessPage,
  townField,
} from 'data/pages/account/firm-details/principle-place-of-business';
import { withAccountSession } from 'lib/accountAuth/withAccountSession';
import { createFormHandler } from 'lib/api/createFormHandler';

const handler = createFormHandler({
  inputs: [
    addressLineOneField,
    addressLineTwoField,
    townField,
    countryField,
    postcodeField,
  ],
  currentRoute: principlePlaceOfBusinessPage.currentRoute,
  nextRoute: principlePlaceOfBusinessPage.nextStep,
  changeAnswerRoute: confirmDetailsPage.currentRoute,
});

export default withAccountSession(handler);
