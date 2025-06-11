import { render, fireEvent } from '@testing-library/react';
import { RadioSelect } from './RadioSelect';

import '@testing-library/jest-dom';

const mockOptions = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
];

describe('RadioSelect', () => {
  it('renders all radio options with correct labels', () => {
    const { container, getByLabelText } = render(
      <RadioSelect
        legend="Select an option"
        fieldName="test-field"
        options={mockOptions}
      />,
    );

    mockOptions.forEach(({ label }) => {
      expect(getByLabelText(label)).toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });

  it('sets the default selected radio based on defaultValue', () => {
    const { getByLabelText } = render(
      <RadioSelect
        legend="Select an option"
        fieldName="test-field"
        options={mockOptions}
        defaultValue="b"
      />,
    );

    const selectedInput = getByLabelText('Option B') as HTMLInputElement;
    expect(selectedInput.checked).toBe(true);
  });

  it('clicking a radio selects it', () => {
    const { getByLabelText } = render(
      <RadioSelect
        legend="Select an option"
        fieldName="test-field"
        options={mockOptions}
      />,
    );

    const optionC = getByLabelText('Option C') as HTMLInputElement;
    fireEvent.click(optionC);

    expect(optionC.checked).toBe(true);
  });
});
