import { fireEvent, render } from '@testing-library/react';
import { InputGroup } from './InputGroup';
import { mockItems, mockSubmittedData } from 'lib/mocks/mockRetirementIncome';
import { RetirementGroupFieldType } from 'lib/types/page.type';

describe('Input group component', () => {
  it('should render the component correctly', () => {
    const { container } = render(
      <InputGroup
        data={mockSubmittedData}
        item={
          mockItems([{ name: 'benefitPension', label: 'Benefit 1' }], true)[0]
        }
        isDynamic={true}
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
        item={mockItems([{ name: 'netIncome' }], true)[0]}
        isDynamic={true}
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
        item={
          mockItems([{ name: 'netIncome', label: 'Net income 1' }], true)[0]
        }
        isDynamic={true}
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
        item={
          mockItems([{ name: 'netIncome', label: 'Net income 1' }], true)[0]
        }
        isDynamic={true}
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
        item={
          mockItems([{ name: 'netIncome', label: 'Net income 1' }], true)[0]
        }
        isDynamic={true}
        onLabelChange={jest.fn()}
        onFrequencyChange={jest.fn()}
        onInputChange={jest.fn()}
        onElementFocusOut={mockInputFocusOut}
      />,
    );

    const labelInput = getByTestId('netIncomeFrequency');
    fireEvent.blur(labelInput);
    expect(mockInputFocusOut).toHaveBeenCalledTimes(1);
  });

  it('renders moreInfo as plain text when infoType is "text"', () => {
    const item = {
      moneyInputName: 'customMoney',
      frequencyName: 'customFrequency',
      inputLabelName: 'customLabel',
      labelText: 'Council Tax or Rates',
      moreInfo: 'Some plain informational text',
      infoType: 'text',
    } as RetirementGroupFieldType;

    const data = {
      customMoney: '0',
      customFrequency: 'month',
      customLabel: '',
    };

    const { getByText } = render(
      <InputGroup
        data={data}
        item={item}
        isDynamic={false}
        onLabelChange={jest.fn()}
        onFrequencyChange={jest.fn()}
        onInputChange={jest.fn()}
        onElementFocusOut={jest.fn()}
      />,
    );

    const toggle = getByText('More information');
    fireEvent.click(toggle);
    expect(getByText('Some plain informational text')).toBeTruthy();
  });

  it('renders moreInfo as HTML when infoType is not "text"', () => {
    const item = {
      moneyInputName: 'tvLicense',
      frequencyName: 'customFrequencyHtml',
      inputLabelName: 'customLabelHtml',
      labelText: 'Paid-for TV and streaming services',
      moreInfo: '<strong>Bold informational HTML</strong>',
      infoType: 'html',
    } as RetirementGroupFieldType;

    const data = {
      customMoneyHtml: '0',
      customFrequencyHtml: 'month',
      customLabelHtml: '',
    };

    const { getByText, container } = render(
      <InputGroup
        data={data}
        item={item}
        isDynamic={false}
        onLabelChange={jest.fn()}
        onFrequencyChange={jest.fn()}
        onInputChange={jest.fn()}
        onElementFocusOut={jest.fn()}
      />,
    );

    const toggle = getByText('More information');
    fireEvent.click(toggle);
    expect(container.querySelector('strong')?.textContent).toBe(
      'Bold informational HTML',
    );
  });
});
