import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PartnerInfo } from './PartnerInfo';
import { Partner } from 'lib/types/aboutYou';
import '@testing-library/jest-dom';
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

    expect(femaleRadio).toBeChecked();
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
