import { fireEvent, render, screen } from '@testing-library/react';

import { mockContent, mockFieldNames } from 'lib/mocks/mockRetirementIncome';
import { SummaryContextProvider } from 'context/SummaryContextProvider';
import RetirementIncomeDetails from './RetirementIncomeDetails';

const renderComponent = () => {
  return render(
    <SummaryContextProvider>
      <RetirementIncomeDetails
        pageData={{}}
        fieldNames={mockFieldNames(['statePension', 'benefitPension'])}
        content={[mockContent]}
      />
    </SummaryContextProvider>,
  );
};

describe('Retirement income component', () => {
  it('should render the component', () => {
    const { container } = renderComponent();
    const accordions = screen.getAllByTestId('expandable-section');
    expect(accordions.length).toBe(2);
    expect(container).toMatchSnapshot();
  });

  it('should add field group when click "Add Pension Pot" button', () => {
    renderComponent();
    const button = screen.getByText('Add pension pot');
    fireEvent.click(button);

    const addedInput = screen.getAllByTestId('benefitPension1Id');
    expect(addedInput.length).toBe(1);
  });

  it('should remove field group when click "Remove" button', async () => {
    renderComponent();
    const button = screen.getByText('Add pension pot');
    fireEvent.click(button);
    const addedInput = screen.getAllByTestId('benefitPension1Id');
    expect(addedInput.length).toBe(1);

    const removeButton = screen.getAllByText('Remove');
    expect(removeButton.length).toBe(2);

    fireEvent.click(removeButton[0]);

    expect(() => screen.getByTestId('benefitPension1Id')).toThrow();
  });

  it('should handle field change successfully', () => {
    renderComponent();

    const label = screen.getAllByTestId('benefitPensionLabel');
    expect(label.length).toBe(1);
    fireEvent.change(label[0], { target: { value: 'my pension' } });
    expect((label[0] as HTMLInputElement).value).toBe('my pension');

    const moneyInput = screen.getAllByTestId('benefitPensionId');
    expect(moneyInput.length).toBe(1);
    fireEvent.change(moneyInput[0], { target: { value: '4000' } });
    expect((moneyInput[0] as HTMLInputElement).value).toBe('4,000');

    const frequency = screen.getAllByTestId('benefitPensionFrequency');
    expect(frequency.length).toBe(1);
    fireEvent.change(frequency[0], { target: { value: 'week' } });
    expect((frequency[0] as HTMLInputElement).value).toBe('week');
  });
});
