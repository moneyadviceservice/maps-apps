import { fireEvent, render } from '@testing-library/react';
import { InputGroup } from './InputGroup';
import {
  mockFieldNames,
  mockSubmittedData,
} from 'lib/mocks/mockRetirementIncome';

describe('Input group component', () => {
  it('should render the component correctly', () => {
    const { container } = render(
      <InputGroup
        data={mockSubmittedData}
        item={mockFieldNames(['yourIncome'])[0]?.items[0]}
        onLabelChange={jest.fn()}
        onFrequencyChange={jest.fn()}
        onInputChange={jest.fn()}
        onElementFocusOut={jest.fn()}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should call label input change handler', () => {
    const mockLabelChange = jest.fn();
    const { getByTestId } = render(
      <InputGroup
        data={mockSubmittedData}
        item={mockFieldNames(['yourIncome', 'netIncome'])[1]?.items[0]}
        onLabelChange={mockLabelChange}
        onFrequencyChange={jest.fn()}
        onInputChange={jest.fn()}
        onElementFocusOut={jest.fn()}
      />,
    );

    const labelInput = getByTestId('netIncomeLabel');
    fireEvent.change(labelInput, { target: { value: 'new label' } });
    expect(mockLabelChange).toHaveBeenCalled();
  });

  it('should call money input change handler', () => {
    const mockMoneyInputChange = jest.fn();
    const { getByTestId } = render(
      <InputGroup
        data={mockSubmittedData}
        item={mockFieldNames(['yourIncome', 'netIncome'])[1]?.items[0]}
        onLabelChange={jest.fn()}
        onFrequencyChange={jest.fn()}
        onInputChange={mockMoneyInputChange}
        onElementFocusOut={jest.fn()}
      />,
    );

    const labelInput = getByTestId('netIncomeId');
    fireEvent.change(labelInput, { target: { value: 'new label' } });
    expect(mockMoneyInputChange).toHaveBeenCalled();
  });

  it('should call frequency dropdown change handler', () => {
    const mockFrequencyChange = jest.fn();
    const { getByTestId } = render(
      <InputGroup
        data={mockSubmittedData}
        item={mockFieldNames(['yourIncome', 'netIncome'])[1]?.items[0]}
        onLabelChange={jest.fn()}
        onFrequencyChange={mockFrequencyChange}
        onInputChange={jest.fn()}
        onElementFocusOut={jest.fn()}
      />,
    );

    const labelInput = getByTestId('netIncomeFrequency');
    fireEvent.change(labelInput, { target: { value: 'week' } });
    expect(mockFrequencyChange).toHaveBeenCalled();
  });

  it('should call onElementFocusOutHandler', () => {
    const mockInputFocusOut = jest.fn();
    const { getByTestId } = render(
      <InputGroup
        data={mockSubmittedData}
        item={mockFieldNames(['yourIncome', 'netIncome'])[1]?.items[0]}
        onLabelChange={jest.fn()}
        onFrequencyChange={jest.fn()}
        onInputChange={jest.fn()}
        onElementFocusOut={mockInputFocusOut}
      />,
    );

    const labelInput = getByTestId('netIncomeFrequency');
    fireEvent.focusOut(labelInput);
    expect(mockInputFocusOut).toHaveBeenCalledTimes(1);
  });
});
