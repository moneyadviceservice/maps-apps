import { render } from '@testing-library/react';

import { Question } from '@maps-react/form/types';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { CookieData, FORM_FIELDS } from '../../data/questions/types';
import { ConsentWrapper } from './ConsentWrapper';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

const variant = FORM_FIELDS.consentDetails;

const mockQuestion: Question = {
  questionNbr: 1,
  group: '',
  title: 'Customer consent',
  type: 'standalone',
  subType: variant,
  errors: {
    message: 'Select whether the customer gives their consent or not.',
  },
  answers: [
    {
      text: 'yes',
    },
    {
      text: 'no',
    },
  ],
};
describe('LastPageWrapper', () => {
  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      z: (key: { en: string; cy: string }) => key.en,
      locale: 'en',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders ConsentWrapper', () => {
    render(
      <ConsentWrapper
        question={mockQuestion}
        variant={variant}
        cookieData={{} as CookieData[typeof variant]}
        errors={[]}
      />,
    );
  });
});
