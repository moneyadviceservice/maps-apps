import { render, screen, fireEvent } from '@testing-library/react';
import { MobileModeSelector } from './MobileModeSelector';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(),
}));

describe('MobileModeSelector', () => {
  const mockZ = jest.fn(({ en }) => en);
  it('renders nothing if showRadioButtons is false', () => {
    const { container } = render(
      <MobileModeSelector
        showRadioButtons={false}
        calculationType="single"
        handleCalculationTypeChange={jest.fn()}
        z={mockZ}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders heading and radio buttons when showRadioButtons is true', () => {
    render(
      <MobileModeSelector
        showRadioButtons={true}
        calculationType="single"
        handleCalculationTypeChange={jest.fn()}
        z={mockZ}
      />,
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Compare with another salary?',
    );
    expect(
      screen.getByTestId('single-calculation-radio-mobile'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('joint-calculation-radio-mobile'),
    ).toBeInTheDocument();
  });

  it('checks the correct radio button based on calculationType', () => {
    render(
      <MobileModeSelector
        showRadioButtons={true}
        calculationType="joint"
        handleCalculationTypeChange={jest.fn()}
        z={mockZ}
      />,
    );
    expect(screen.getByTestId('joint-calculation-radio-mobile')).toBeChecked();
    expect(
      screen.getByTestId('single-calculation-radio-mobile'),
    ).not.toBeChecked();
  });

  it('calls handleCalculationTypeChange when a radio button is clicked', () => {
    const handleChange = jest.fn();
    const { rerender } = render(
      <MobileModeSelector
        showRadioButtons={true}
        calculationType="single"
        handleCalculationTypeChange={handleChange}
        z={mockZ}
      />,
    );
    fireEvent.click(screen.getByTestId('joint-calculation-radio-mobile'));
    expect(handleChange).toHaveBeenCalledWith('joint');

    // Simulate parent updating calculationType to "joint"
    rerender(
      <MobileModeSelector
        showRadioButtons={true}
        calculationType="joint"
        handleCalculationTypeChange={handleChange}
        z={mockZ}
      />,
    );
    fireEvent.click(screen.getByTestId('single-calculation-radio-mobile'));
    expect(handleChange).toHaveBeenCalledWith('single');
  });
});
