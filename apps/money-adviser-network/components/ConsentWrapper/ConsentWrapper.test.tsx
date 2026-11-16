import { render } from '@testing-library/react';

import { CookieData, FORM_FIELDS } from '../../data/questions/types';
import { ErrorType, Question } from '@maps-react/form/types';
import { ConsentWrapper } from './ConsentWrapper';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn().mockReturnValue({
    z: jest.fn(({ en }) => en),
  }),
}));

const questionMock: Question = {
  questionNbr: 1,
  group: 'consent',
  title: 'Consent Question',
  type: 'radio',
  answers: [
    { text: 'Yes', value: 'yes' },
    { text: 'No', value: 'no' },
  ],
  classes: ['text-[18px]'],
  errors: {
    message: 'Please provide consent to continue',
  },
};

describe('ConsentWrapper Component', () => {
  it('should render the default state of the component', () => {
    const { container, getByText, getByLabelText } = render(
      <ConsentWrapper
        question={questionMock}
        variant={FORM_FIELDS.consentReferral}
        cookieData={{} as CookieData['consentReferral']}
        errors={[]}
      />,
    );

    expect(getByText('Does the customer give consent?')).toBeInTheDocument();
    expect(getByLabelText('Yes')).toBeInTheDocument();
    expect(getByLabelText('No')).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it('renders with errors', () => {
    const errors: ErrorType[] = [
      { question: FORM_FIELDS.consentReferral, message: 'Form error state' },
    ];

    const { container, getByText } = render(
      <ConsentWrapper
        question={questionMock}
        variant={FORM_FIELDS.consentReferral}
        cookieData={{} as CookieData['consentReferral']}
        errors={errors}
      />,
    );

    expect(getByText('Please provide consent to continue')).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it('renders default cookieData values correctly', () => {
    const { container, getByLabelText } = render(
      <ConsentWrapper
        question={questionMock}
        variant={FORM_FIELDS.consentReferral}
        cookieData={
          {
            value: '1',
          } as CookieData['consentReferral']
        }
        errors={[]}
      />,
    );

    const yesRadio = getByLabelText('Yes');
    const noRadio = getByLabelText('No');

    expect(yesRadio).not.toBeChecked();
    expect(noRadio).toBeChecked();

    expect(container).toMatchSnapshot();
  });
});
