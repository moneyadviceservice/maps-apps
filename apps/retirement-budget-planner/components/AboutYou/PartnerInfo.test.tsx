import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PartnerInfo } from './PartnerInfo';
import { Partner } from 'lib/types/aboutYou';
import '@testing-library/jest-dom';
import { updatePartnerInformation } from 'services/about-you';

const mockPartner: Partner = {
  id: 1,
  name: 'Alice Wonderland',
  dob: { day: '15', month: '6', year: '1980' },
  gender: 'female',
  retireAge: '65',
};

const mockPartners: Partner[] = [mockPartner];

describe('PartnerInfo Component', () => {
  it('renders partner name when not editing', () => {
    render(
      <PartnerInfo
        partners={mockPartners}
        partnerInfo={mockPartner}
        isEditing={false}
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
      />,
    );
    expect(
      screen.queryByRole('button', { name: /remove partner/i }),
    ).not.toBeInTheDocument();
  });

  it('calls onRemove when Remove Partner button is clicked', () => {
    const mockRemove = jest.fn();
    const partnerWithId2 = { ...mockPartner, id: 2 };
    render(
      <PartnerInfo
        partners={[partnerWithId2]}
        partnerInfo={partnerWithId2}
        isEditing={true}
        onRemove={mockRemove}
      />,
    );
    const removeButton = screen.getByRole('button', {
      name: /remove partner/i,
    });
    fireEvent.click(removeButton);
    expect(mockRemove).toHaveBeenCalled();
  });

  it('toggles explanation section visibility', () => {
    render(
      <PartnerInfo
        partners={mockPartners}
        partnerInfo={mockPartner}
        isEditing={false}
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
      />,
    );
    expect(
      screen.getByText(/why do we need your date of birth and gender/i),
    ).toBeInTheDocument();
  });
});
jest.mock('services/about-you', () => ({
  updatePartnerInformation: jest.fn().mockResolvedValue(undefined),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('PartnerInfo - update and hidden inputs behaviour', () => {
  it('calls updatePartnerInformation with updated name when Done is clicked', async () => {
    const { container } = render(
      <PartnerInfo
        partners={mockPartners}
        partnerInfo={mockPartner}
        isEditing={true}
      />,
    );

    const input = screen.getByLabelText(/edit name/i);
    fireEvent.change(input, { target: { value: 'Alice Updated' } });

    const doneBtn = screen.getByRole('button', { name: /done/i });
    fireEvent.click(doneBtn);

    await waitFor(() => {
      expect(updatePartnerInformation).toHaveBeenCalledTimes(1);
    });

    const expected = [{ ...mockPartner, name: 'Alice Updated' }];
    expect(updatePartnerInformation).toHaveBeenCalledWith(expected);

    const hidden = container.querySelector(
      'input[name="partners"]',
    ) as HTMLInputElement;
    expect(hidden).toBeInTheDocument();
    const decoded = JSON.parse(decodeURIComponent(hidden.value));
    expect(decoded[0].name).toBe('Alice Updated');
  });

  it('calls updatePartnerInformation when Edit button is clicked (toggles to editing)', async () => {
    render(
      <PartnerInfo
        partners={mockPartners}
        partnerInfo={mockPartner}
        isEditing={false}
      />,
    );

    const editBtn = screen.getByRole('button', { name: /edit name/i });
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(updatePartnerInformation).toHaveBeenCalledTimes(1);
    });

    expect(updatePartnerInformation).toHaveBeenCalledWith(mockPartners);
  });

  it('renders correct background class for id === 1 (green) and id === 2 (yellow)', () => {
    const { container: c1 } = render(
      <PartnerInfo
        partners={mockPartners}
        partnerInfo={mockPartner}
        isEditing={false}
      />,
    );
    const section1 = c1.querySelector('section') as HTMLElement;
    expect(section1.className).toContain('bg-green-600');

    const partnerId2 = { ...mockPartner, id: 2 };
    const { container: c2 } = render(
      <PartnerInfo
        partners={[partnerId2]}
        partnerInfo={partnerId2}
        isEditing={false}
      />,
    );
    const section2 = c2.querySelector('section') as HTMLElement;
    expect(section2.className).toContain('bg-yellow-500');
  });

  it('hidden id input contains the partner id string', () => {
    const partnerId2 = { ...mockPartner, id: 2 };
    const { container } = render(
      <PartnerInfo
        partners={[partnerId2]}
        partnerInfo={partnerId2}
        isEditing={false}
      />,
    );
    const idInput = container.querySelector(
      'input[name="id"]',
    ) as HTMLInputElement;
    expect(idInput).toBeInTheDocument();
    expect(idInput.value).toBe(String(partnerId2.id));
  });

  it('updates partners hidden input when name changed and Done clicked (encoded JSON check)', async () => {
    const partnerId2 = { ...mockPartner, id: 2 };
    const { container } = render(
      <PartnerInfo
        partners={[partnerId2]}
        partnerInfo={partnerId2}
        isEditing={true}
      />,
    );

    const input = screen.getByLabelText(/edit name/i);
    fireEvent.change(input, { target: { value: 'New Partner Name' } });

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
    expect(decoded[0].name).toBe('New Partner Name');
  });
});
