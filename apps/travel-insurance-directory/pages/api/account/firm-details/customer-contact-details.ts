import { confirmDetailsPage } from 'data/pages/account/firm-details/confirm-details';
import {
  customerContactDetailsPage,
  emailField,
  telephoneNumberField,
  websiteAddressField,
} from 'data/pages/account/firm-details/customer-contact-details';
import { withAccountSession } from 'lib/accountAuth/withAccountSession';
import { createFormHandler } from 'lib/api/createFormHandler';

const handler = createFormHandler({
  inputs: [emailField, telephoneNumberField, websiteAddressField],
  currentRoute: customerContactDetailsPage.currentRoute,
  nextRoute: customerContactDetailsPage.nextStep,
  changeAnswerRoute: confirmDetailsPage.currentRoute,
  preValidate: (body, inputs) => {
    const hasEmail =
      typeof body[emailField.key] === 'string' &&
      body[emailField.key].trim() !== '';
    const hasPhone =
      typeof body[telephoneNumberField.key] === 'string' &&
      body[telephoneNumberField.key].trim() !== '';

    return inputs.map((input) => {
      if (input.key === emailField.key) {
        // Only required if they didn't provide a phone number
        return { ...input, required: !hasPhone };
      }
      if (input.key === telephoneNumberField.key) {
        // Only required if they didn't provide an email address
        return { ...input, required: !hasEmail };
      }
      return input;
    });
  },
});

export default withAccountSession(handler);
