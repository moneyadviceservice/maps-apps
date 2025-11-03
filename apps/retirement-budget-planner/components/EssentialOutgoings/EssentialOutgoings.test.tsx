import {
  mockFielsNames,
  mockPageContent,
  mockPageData,
} from 'lib/mocks/mockEssentialOutgoings';
import { EssentialOutgoings } from './EssentialOutgoings';
import { fireEvent, render, screen } from '@testing-library/react';
import { SummaryContextProvider } from 'context/SummaryContextProvider';
import { saveDataToMemoryOnFocusOut } from 'lib/util/contentFilter';
import { sumFields } from 'lib/util/summaryCalculations/calculations';

jest.mock('lib/util/contentFilter/contentFilter', () => ({
  saveDataToMemoryOnFocusOut: jest.fn(),
}));

jest.mock('lib/util/summaryCalculations/calculations', () => ({
  sumFields: jest.fn().mockReturnValue(0),
}));

const renderWithContext = (
  props?: Partial<React.ComponentProps<typeof EssentialOutgoings>>,
) => {
  return render(
    <SummaryContextProvider>
      <EssentialOutgoings
        pageData={mockPageData()}
        fieldNames={mockFielsNames()}
        pageContent={mockPageContent()}
        tabName={'essential-outgoings'}
        sessionId={'ASGDHB'}
        summaryData={undefined}
        {...props}
      />
    </SummaryContextProvider>,
  );
};

describe('Essential outgoings component', () => {
  it('should render component', () => {
    const { container } = renderWithContext();
    expect(container).toMatchSnapshot();
  });

  it('should handle field change successfully', () => {
    renderWithContext();

    const label = screen.getAllByTestId('additionalInput1Label');
    expect(label.length).toBe(1);
    fireEvent.change(label[0], { target: { value: 'car' } });
    expect((label[0] as HTMLInputElement).value).toBe('car');

    const emptylabel = screen.getAllByTestId('additionalInput1Label');
    expect(label.length).toBe(1);
    fireEvent.change(emptylabel[0], { target: { value: '' } });
    expect((emptylabel[0] as HTMLInputElement).value).toBe('');

    const moneyInput = screen.getAllByTestId('additionalInput1Id');
    expect(moneyInput.length).toBe(1);
    fireEvent.change(moneyInput[0], { target: { value: '4000' } });
    expect((moneyInput[0] as HTMLInputElement).value).toBe('4,000');

    const frequency = screen.getAllByTestId('additionalInput1Frequency');
    expect(frequency.length).toBe(1);
    fireEvent.change(frequency[0], { target: { value: 'week' } });
    expect((frequency[0] as HTMLInputElement).value).toBe('week');
  });

  it('should save data to redis on focus out', () => {
    const mockSaveDataToMemory = jest.fn();
    (saveDataToMemoryOnFocusOut as jest.Mock).mockImplementation(
      mockSaveDataToMemory,
    );
    renderWithContext();
    fireEvent.focusOut(screen.getByTestId('mortgageId'));

    expect(mockSaveDataToMemory).toHaveBeenCalledTimes(1);
  });

  it('should update spending summary data', () => {
    const mockSumfields = jest.fn();
    (sumFields as jest.Mock).mockImplementation(mockSumfields);

    renderWithContext({
      summaryData: {
        income: 200,
        spending: 0,
      },
    });

    const moneyInput = screen.getAllByTestId('mortgageId');
    expect(moneyInput.length).toBe(1);
    fireEvent.change(moneyInput[0], { target: { value: '100' } });
    expect(mockSumfields).toHaveBeenCalledTimes(1);
  });
});
