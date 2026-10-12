import {
  customerContactDetailsPage,
  emailField,
  telephoneNumberField,
  websiteAddressField,
} from './customer-contact-details';
import {
  closingTimeField,
  openingHoursPage,
  openingTimeField,
  saturdayClosingField,
  saturdayOpeningField,
  saturdayOpeningRadioField,
  sundayClosingField,
  sundayOpeningField,
  sundayOpeningRadioField,
} from './opening-hours';
import {
  addressLineOneField,
  addressLineTwoField,
  countryField,
  postcodeField,
  principlePlaceOfBusinessPage,
  townField,
} from './principle-place-of-business';

export const confirmDetailsPage = {
  title: 'Confirm details',
  backLink: '/account/firm-details/opening-hours',
  formKey: 'confirm-details',
  submitApi: '/api/account/firm-details/confirm-details',
  nextStep: '/account',
  currentRoute: '/account/firm-details/confirm-details',
  buttonLabel: 'Confirm',
  questionsSections: [
    {
      title: customerContactDetailsPage.title,
      key: customerContactDetailsPage.formKey,
      questions: [
        {
          ...websiteAddressField,
        },
        {
          ...telephoneNumberField,
        },
        {
          ...emailField,
        },
      ],
      linkToPage: customerContactDetailsPage.currentRoute,
    },
    {
      title: principlePlaceOfBusinessPage.title,
      key: principlePlaceOfBusinessPage.formKey,
      questions: [
        {
          ...addressLineOneField,
        },
        {
          ...addressLineTwoField,
        },
        {
          ...townField,
        },
        {
          ...countryField,
        },
        {
          ...postcodeField,
        },
      ],
      linkToPage: principlePlaceOfBusinessPage.currentRoute,
    },
    {
      title: openingHoursPage.title,
      key: openingHoursPage.formKey,
      questions: [
        {
          ...openingTimeField,
        },
        {
          ...closingTimeField,
        },
        {
          ...saturdayOpeningRadioField,
        },
        {
          ...saturdayOpeningField,
        },
        {
          ...saturdayClosingField,
        },
        {
          ...sundayOpeningRadioField,
        },
        {
          ...sundayOpeningField,
        },
        {
          ...sundayClosingField,
        },
      ],
      linkToPage: openingHoursPage.currentRoute,
    },
  ],
};
