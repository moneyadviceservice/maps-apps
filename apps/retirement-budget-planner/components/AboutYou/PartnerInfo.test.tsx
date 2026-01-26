import type { ReactNode } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PartnerInfo } from './PartnerInfo';
import { Partner } from 'lib/types/aboutYou';
import '@testing-library/jest-dom';

import useTranslation from '@maps-react/hooks/useTranslation';
jest.mock('@maps-react/hooks/useTranslation');

const mockUseTranslation = useTranslation as jest.Mock;
const mockPartner: Partner = {
  id: 1,
  dob: { day: '15', month: '6', year: '1980' },
  gender: 'female',
  retireAge: '65',
};
const mockPartner2: Partner = {
  id: 1,
  dob: { day: '', month: '', year: '' },
  gender: '',
  retireAge: '',
};
const formErrorValues = {
  id: '',
  gender: 'gender-generic',
  dob: 'dob-empty',
  retireAge: '',
};
jest.mock('context/SessionContextProvider', () => ({
  useSessionId: jest.fn(() => 'test-session-id'),
  SessionIdProvider: ({ children }: { children: ReactNode }) => children,
}));
jest.mock('lib/validation/partner', () => ({
  hasFieldError: (key: string, errors?: Record<string, string> | null) =>
    errors?.[key]
      ? [
          {
            question: key,
            message: errors[key],
          },
        ]
      : [],
  getErrorMessageByKey: (key: string, errors?: Record<string, string> | null) =>
    errors?.[key] ?? '',
}));
jest.mock('services/about-you', () => ({
  updatePartnerInformation: jest.fn().mockResolvedValue(undefined),
}));
describe('PartnerInfo Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => {
        const translations: { [key: string]: string } = {
          'aboutYou.dob.labelText': 'What is your date of birth?',
          'aboutYou.dob.day': 'Day',
          'aboutYou.dob.month': 'Month',
          'aboutYou.dob.year': 'Year',
          'aboutYou.gender.labelText': 'What is your gender?',
          'aboutYou.gender.male': 'Male',
          'aboutYou.gender.female': 'Female',
          'aboutYou.retireAge.labelText':
            'I would like to retire at the age of:',
          'aboutYou.retireAge.inputText': 'years',
          'aboutYou.moreInfo.moreInfoLink':
            'Why do we need your date of birth and gender?',
          'aboutYou.moreInfo.infoText': 'To calculate your State Pension age ',
          'aboutYou.errors.dob-empty': 'Enter a valid date of birth',
          'aboutYou.errors.dob-age-range':
            'You need to be between 18 and 74 years old to use this service',
          'aboutYou.errors.gender-generic': 'Gender is required',
          'aboutYou.errors.retire-age-empty': 'Your retire age can’t be blank',
          'aboutYou.errors.retire-age-range':
            'Your retirement age must be between 55 and 99.',
        };
        return translations[key] || key;
      },
    });
  });

  it('renders DOB fields with correct default values', () => {
    render(<PartnerInfo partnerInfo={mockPartner} formErrors={null} />);

    expect(screen.getByLabelText(/day/i)).toHaveValue(15);
    expect(screen.getByLabelText(/month/i)).toHaveValue(6);
    expect(screen.getByLabelText(/year/i)).toHaveValue(1980);
  });

  it('renders gender radio buttons with correct default', () => {
    render(<PartnerInfo partnerInfo={mockPartner} formErrors={null} />);

    const radios = screen.getAllByRole('radio');
    const maleRadio = radios.find(
      (radio) => radio.getAttribute('value') === 'male',
    );
    const femaleRadio = radios.find(
      (radio) => radio.getAttribute('value') === 'female',
    );

    expect(femaleRadio).toBeDefined();
    expect(femaleRadio).toBeChecked();
    expect(maleRadio).toBeDefined();
    expect(maleRadio).not.toBeChecked();
  });

  it('allows changing gender selection', () => {
    render(<PartnerInfo partnerInfo={mockPartner} formErrors={null} />);

    const radios = screen.getAllByRole('radio');
    const maleRadio = radios.find(
      (radio) => radio.getAttribute('value') === 'male',
    );

    expect(maleRadio).toBeInTheDocument();
    fireEvent.click(maleRadio!);
    expect(maleRadio).toBeChecked();
  });

  it('renders retire age field and allows editing', () => {
    render(<PartnerInfo partnerInfo={mockPartner} formErrors={null} />);

    const retireAgeInput = screen.getByTestId('number-input');
    fireEvent.change(retireAgeInput, { target: { value: '67' } });
    expect(retireAgeInput).toHaveValue('67');
  });

  it('renders expandable section with explanation', () => {
    render(<PartnerInfo partnerInfo={mockPartner} formErrors={null} />);

    expect(
      screen.getByText(/why do we need your date of birth and gender/i),
    ).toBeInTheDocument();
  });

  it('displays validation errors when formErrors prop is provided', async () => {
    render(
      <PartnerInfo partnerInfo={mockPartner2} formErrors={formErrorValues} />,
    );

    expect(
      await screen.findByText('Enter a valid date of birth'),
    ).toBeInTheDocument();

    expect(await screen.findByText('Gender is required')).toBeInTheDocument();
  });
});

afterEach(() => {
  jest.clearAllMocks();
});
