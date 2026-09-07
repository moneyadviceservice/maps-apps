import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import { CalculationTypeSelector } from './CalculationTypeSelector';

// Mock useTranslation

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(),
}));

// Mock RadioButton to behave like a real input
jest.mock('@maps-react/form/components/RadioButton', () => ({
  RadioButton: ({ children, checked, onChange, ...props }: any) => (
    <label>
      <input type="radio" checked={checked} onChange={onChange} {...props} />
      {children}
    </label>
  ),
}));

const mockZ = jest.fn((translation: any) => translation.en);

describe('CalculationTypeSelector', () => {
  it('renders nothing when showRadioButtons is false', () => {
    const { container } = render(
      <CalculationTypeSelector
        calculationType="single"
        setCalculationType={jest.fn()}
        showRadioButtons={false}
        z={mockZ}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders both radio buttons when showRadioButtons is true', () => {
    render(
      <CalculationTypeSelector
        calculationType="single"
        setCalculationType={jest.fn()}
        showRadioButtons={true}
        z={mockZ}
      />,
    );

    expect(screen.getByTestId('single-calculation-radio')).toBeInTheDocument();

    expect(screen.getByTestId('joint-calculation-radio')).toBeInTheDocument();
  });

  it('marks single as checked when calculationType is single', () => {
    render(
      <CalculationTypeSelector
        calculationType="single"
        setCalculationType={jest.fn()}
        showRadioButtons={true}
        z={mockZ}
      />,
    );

    expect(screen.getByTestId('single-calculation-radio')).toBeChecked();

    expect(screen.getByTestId('joint-calculation-radio')).not.toBeChecked();
  });

  it('marks joint as checked when calculationType is joint', () => {
    render(
      <CalculationTypeSelector
        calculationType="joint"
        setCalculationType={jest.fn()}
        showRadioButtons={true}
        z={mockZ}
      />,
    );

    expect(screen.getByTestId('joint-calculation-radio')).toBeChecked();

    expect(screen.getByTestId('single-calculation-radio')).not.toBeChecked();
  });

  it('calls setCalculationType when a radio button is clicked', () => {
    const setCalculationType = jest.fn();

    render(
      <CalculationTypeSelector
        calculationType="single"
        setCalculationType={setCalculationType}
        showRadioButtons={true}
        z={mockZ}
      />,
    );

    fireEvent.click(screen.getByTestId('joint-calculation-radio'));

    expect(setCalculationType).toHaveBeenCalledWith('joint');
  });
});
