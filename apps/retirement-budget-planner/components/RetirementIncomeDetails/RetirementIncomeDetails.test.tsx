import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { mockContent, mockFieldNames } from 'lib/mocks/mockRetirementIncome';
import { SummaryContextProvider } from 'context/SummaryContextProvider';
import RetirementIncomeDetails from './RetirementIncomeDetails';
import * as Filter from 'lib/util/contentFilter/contentFilter';

jest.mock('lib/util/summaryCalculations/calculations', () => ({
  sumFields: jest.fn().mockReturnValue(0),
}));

jest.mock('lib/util/contentFilter/contentFilter', () => ({
  saveDataToMemoryOnFocusOut: jest.fn(),
  createNewMoneyInputFrequencyItem: jest.fn(),
  removeMoneyInputFrequencyItem: jest.fn(),
}));

globalThis.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
  }),
);

const renderComponent = () => {
  return render(
    <SummaryContextProvider>
      <RetirementIncomeDetails
        pageData={{}}
        fieldNames={mockFieldNames(['statePension', 'benefitPension'])}
        content={[mockContent]}
        sessionId={'AUHJK'}
        tabName={'income'}
        stepsEnabled="2"
      />
    </SummaryContextProvider>,
  );
};

describe('Retirement income component', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
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

  it('should return error message when saving to Redis is not successul', () => {
    const spyWarn = jest.spyOn(console, 'error');
    (globalThis.fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve(() => ({
        ok: false,
      })),
    );
    renderComponent();

    const button = screen.getByText('Add pension pot');
    fireEvent.click(button);

    waitFor(() => {
      expect(spyWarn).toHaveBeenCalled();
      spyWarn.mockClear();
    });
  });

  it('shoud call function to save data to redis on focus out', () => {
    const spyOnDataSave = jest.spyOn(Filter, 'saveDataToMemoryOnFocusOut');
    renderComponent();
    const inputfield = screen.getByTestId('benefitPensionId');
    fireEvent.focusOut(inputfield);

    expect(spyOnDataSave).toHaveBeenCalledTimes(1);
    spyOnDataSave.mockReset();
  });

  it('should remove field group when click "Remove" button', async () => {
    const mockContent = [...mockFieldNames(['statePension', 'benefitPension'])];
    const addMockItem = [
      mockContent[0],
      {
        ...mockContent[1],
        items: [
          ...mockContent[1].items,
          {
            index: 2,
            inputLabelName: 'benefitPension2Label',
            moneyInputName: 'benefitPension2',
            frequencyName: 'benefitPension2Frequency',
          },
        ],
      },
    ];

    (Filter.createNewMoneyInputFrequencyItem as jest.Mock).mockReturnValue(
      addMockItem,
    );

    renderComponent();
    const button = screen.getByText('Add pension pot');
    fireEvent.click(button);
    const addedInput = screen.getAllByTestId('benefitPension1Id');
    expect(addedInput.length).toBe(1);

    waitFor(() => {
      const removeButton = screen.getAllByText('Remove');
      expect(removeButton.length).toBe(2);
      fireEvent.click(removeButton[0]);
      expect(() => screen.getByTestId('benefitPension1Id')).toThrow();
    });
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
