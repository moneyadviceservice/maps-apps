import type { ReactNode } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { PartnerInfo } from './PartnerInfo';
import { Partner } from 'lib/types/aboutYou';
import '@testing-library/jest-dom';
import { updatePartnerInformation } from 'services/about-you';
import useTranslation from '@maps-react/hooks/useTranslation';
jest.mock('@maps-react/hooks/useTranslation');

const mockUseTranslation = useTranslation as jest.Mock;
const mockPartner: Partner = {
  id: 1,
  name: 'Alice Wonderland',
  dob: { day: '15', month: '6', year: '1980' },
  gender: 'female',
  retireAge: '65',
};

const mockPartners: Partner[] = [mockPartner];
const mockPartner2: Partner = {
  id: 1,
  name: '',
  dob: { day: '', month: '', year: '' },
  gender: '',
  retireAge: '',
};
const basePartners: Partner[] = [mockPartner2];
const formErrorValues = {
  id: '',
  name: 'name-generic',
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
          'aboutYou.name.labelText': 'Edit name',
          'aboutYou.name.editButton': 'Done',
          'aboutYou.name.editLink': 'Edit name',
          'aboutYou.removePartner.buttonLabel': 'Remove partner',
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
          'aboutYou.errors.name-generic': 'Name is required',
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
  it('renders partner name when not editing', () => {
    render(
      <PartnerInfo
        partners={mockPartners}
        partnerInfo={mockPartner}
        isEditing={false}
        onPartnerDetailsChange={jest.fn()}
      />,
    );
    expect(screen.getByText('Alice Wonderland')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /edit name/i }),
    ).toBeInTheDocument();
  });

  it('shows input field when editing is enabled', () => {
    render(
      <PartnerInfo
        partners={mockPartners}
        partnerInfo={mockPartner}
        isEditing={true}
        onPartnerDetailsChange={jest.fn()}
      />,
    );
    expect(screen.getByLabelText(/edit name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /done/i })).toBeInTheDocument();
  });

  it('allows editing the name and saving', () => {
    render(
      <PartnerInfo
        partners={mockPartners}
        partnerInfo={mockPartner}
        isEditing={true}
        onPartnerDetailsChange={jest.fn()}
      />,
    );
    const input = screen.getByLabelText(/edit name/i);
    fireEvent.change(input, { target: { value: 'Alice Wonderland' } });
    expect(input).toHaveValue('Alice Wonderland');
  });

  it('renders DOB fields with correct default values', () => {
    render(
      <PartnerInfo
        partners={mockPartners}
        partnerInfo={mockPartner}
        isEditing={true}
        onPartnerDetailsChange={jest.fn()}
      />,
    );

    expect(screen.getByLabelText(/day/i)).toHaveValue(15);
    expect(screen.getByLabelText(/month/i)).toHaveValue(6);
    expect(screen.getByLabelText(/year/i)).toHaveValue(1980);
  });

  it('renders gender radio buttons with correct default', () => {
    render(
      <PartnerInfo
        partners={mockPartners}
        partnerInfo={mockPartner}
        isEditing={true}
        onPartnerDetailsChange={jest.fn()}
      />,
    );

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
    render(
      <PartnerInfo
        partners={mockPartners}
        partnerInfo={mockPartner}
        isEditing={true}
        onPartnerDetailsChange={jest.fn()}
      />,
    );

    const radios = screen.getAllByRole('radio');
    const maleRadio = radios.find(
      (radio) => radio.getAttribute('value') === 'male',
    );

    expect(maleRadio).toBeInTheDocument();
    fireEvent.click(maleRadio!);
    expect(maleRadio).toBeChecked();
  });

  it('does not render Remove Partner button for first partner', () => {
    render(
      <PartnerInfo
        partners={mockPartners}
        partnerInfo={mockPartner}
        isEditing={true}
        onPartnerDetailsChange={jest.fn()}
      />,
    );
    expect(
      screen.queryByRole('button', { name: /remove partner/i }),
    ).not.toBeInTheDocument();
  });

  it('toggles explanation section visibility', () => {
    render(
      <PartnerInfo
        partners={mockPartners}
        partnerInfo={mockPartner}
        isEditing={false}
        onPartnerDetailsChange={jest.fn()}
      />,
    );
    const section = screen.getByTestId('expandable-section');
    const toggle = section.querySelector('summary');

    if (toggle) {
      fireEvent.click(toggle);
      expect(screen.getByText(/state pension age/i)).toBeVisible();
    }
  });

  it('renders retire age field and allows editing', () => {
    render(
      <PartnerInfo
        partners={mockPartners}
        partnerInfo={mockPartner}
        isEditing={true}
        onPartnerDetailsChange={jest.fn()}
      />,
    );
    const retireAgeInput = screen.getByTestId('number-input');
    fireEvent.change(retireAgeInput, { target: { value: '67' } });
    expect(retireAgeInput).toHaveValue('67');
  });

  it('renders expandable section with explanation', () => {
    render(
      <PartnerInfo
        partners={mockPartners}
        partnerInfo={mockPartner}
        isEditing={false}
        onPartnerDetailsChange={jest.fn()}
      />,
    );
    expect(
      screen.getByText(/why do we need your date of birth and gender/i),
    ).toBeInTheDocument();
  });
  it('calls updatePartnerInformation with updated name when Done is clicked', async () => {
    const { container } = render(
      <PartnerInfo
        partners={mockPartners}
        partnerInfo={mockPartner}
        isEditing={true}
        onPartnerDetailsChange={jest.fn()}
      />,
    );

    const input = screen.getByLabelText(/edit name/i);
    fireEvent.change(input, { target: { value: 'Alice Updated' } });

    const doneBtn = screen.getByRole('button', { name: /done/i });
    fireEvent.click(doneBtn);

    await waitFor(() => {
      expect(updatePartnerInformation).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      const hidden = container.querySelector(
        'input[name="partners"]',
      ) as HTMLInputElement;
      expect(hidden).toBeInTheDocument();
      const decoded = JSON.parse(decodeURIComponent(hidden.value));

      expect(decoded[0].name).toBeTruthy();
    });
  });

  it('calls updatePartnerInformation when Edit button is clicked (toggles to editing)', async () => {
    render(
      <PartnerInfo
        partners={mockPartners}
        partnerInfo={mockPartner}
        isEditing={false}
        onPartnerDetailsChange={jest.fn()}
      />,
    );

    const editBtn = screen.getByRole('button', { name: /edit name/i });
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(updatePartnerInformation).toHaveBeenCalledTimes(1);
    });

    expect(updatePartnerInformation).toHaveBeenCalledWith(
      mockPartners,
      'test-session-id',
    );
  });

  it('renders correct background class for id === 2 (gray)', () => {
    const partnerId2 = { ...mockPartner, id: 2 };
    const { container: c2 } = render(
      <PartnerInfo
        partners={[partnerId2]}
        partnerInfo={partnerId2}
        isEditing={false}
        onPartnerDetailsChange={jest.fn()}
      />,
    );
    const section2 = c2.querySelector('section') as HTMLElement;
    expect(section2.className).toContain('bg-slate-200');
  });

  it('hidden id input contains the partner id string', () => {
    const partnerId2 = { ...mockPartner, id: 2 };
    const { container } = render(
      <PartnerInfo
        partners={[partnerId2]}
        partnerInfo={partnerId2}
        isEditing={false}
        onPartnerDetailsChange={jest.fn()}
      />,
    );
    const idInput = container.querySelector(
      'input[name="id"]',
    ) as HTMLInputElement;
    expect(idInput).toBeInTheDocument();
    expect(idInput.value).toBe(String(partnerId2.id));
  });

  it('updates partners hidden input when name changed and Done clicked (encoded JSON check)', async () => {
    const partnerId2 = { ...mockPartner, id: 2, name: 'Partner Two' };
    const { container } = render(
      <PartnerInfo
        partners={[partnerId2]}
        partnerInfo={partnerId2}
        isEditing={true}
        onPartnerDetailsChange={jest.fn()}
      />,
    );

    const input = screen.getByLabelText(/edit name/i);
    fireEvent.change(input, { target: { value: 'Partner Two' } });

    const doneBtn = screen.getByRole('button', { name: /done/i });
    fireEvent.click(doneBtn);

    await waitFor(() => {
      expect(updatePartnerInformation).toHaveBeenCalled();
    });

    const hidden = container.querySelector(
      'input[name="partners"]',
    ) as HTMLInputElement;
    expect(hidden).toBeInTheDocument();
    const decoded = JSON.parse(decodeURIComponent(hidden.value));
    expect(decoded[0].name).toBe('Partner Two');
  });
  it('removes the partner and calls updatePartnerInformation and onPartnerDetailsChange when Remove Partner is clicked', async () => {
    const onPartnerDetailsChange = jest.fn();
    const partnerToRemove = {
      id: 2,
      name: 'Bob Builder',
      dob: { day: '5', month: '1', year: '1960' },
      gender: 'male',
      retireAge: '65',
    };
    const partners = [mockPartner, partnerToRemove];
    const sessionId = 'test-session-id';
    render(
      <PartnerInfo
        partners={partners}
        partnerInfo={partnerToRemove}
        isEditing={false}
        onPartnerDetailsChange={onPartnerDetailsChange}
      />,
    );

    const removeBtn = screen.getByRole('button', { name: /remove partner/i });

    fireEvent.click(removeBtn);

    await waitFor(() => {
      expect(updatePartnerInformation).toHaveBeenCalledTimes(1);

      expect(onPartnerDetailsChange).toHaveBeenCalledTimes(1);
    });

    const updatedPartners = (updatePartnerInformation as jest.Mock).mock
      .calls[0][0] as Partner[];

    const passedSessionId = (updatePartnerInformation as jest.Mock).mock
      .calls[0][1] as string;

    expect(updatedPartners.find((p) => p.id === 2)).toBeUndefined();

    expect(passedSessionId).toBe(sessionId);

    const onChangeArg = (onPartnerDetailsChange as jest.Mock).mock
      .calls[0][0] as Partner[];

    expect(onChangeArg.find((p) => p.id === 2)).toBeUndefined();
  });
  it('displays validation errors when formErrors prop is provided', async () => {
    render(
      <PartnerInfo
        partners={basePartners}
        partnerInfo={mockPartner2}
        isEditing={false}
        onPartnerDetailsChange={jest.fn()}
        formErrors={formErrorValues}
      />,
    );
    expect(
      await screen.findByText('Enter a valid date of birth'),
    ).toBeInTheDocument();

    expect(await screen.findByText('Gender is required')).toBeInTheDocument();
    expect(await screen.findByText('Name is required')).toBeInTheDocument();
  });
});

afterEach(() => {
  jest.clearAllMocks();
});
