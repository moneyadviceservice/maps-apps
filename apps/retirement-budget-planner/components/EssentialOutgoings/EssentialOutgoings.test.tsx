import {
  mockFielsNames,
  mockPageContent,
  mockPageData,
} from 'lib/mocks/mockEssentialOutgoings';
import { EssentialOutgoings } from './EssentialOutgoings';
import { fireEvent, render, screen } from '@testing-library/react';
import { SummaryContextProvider } from 'context/SummaryContextProvider';

const renderWithContext = () => {
  return render(
    <SummaryContextProvider>
      <EssentialOutgoings
        pageData={mockPageData()}
        fieldNames={mockFielsNames()}
        pageContent={mockPageContent()}
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

    const moneyInput = screen.getAllByTestId('additionalInput1Id');
    expect(moneyInput.length).toBe(1);
    fireEvent.change(moneyInput[0], { target: { value: '4000' } });
    expect((moneyInput[0] as HTMLInputElement).value).toBe('4,000');

    const frequency = screen.getAllByTestId('additionalInput1Frequency');
    expect(frequency.length).toBe(1);
    fireEvent.change(frequency[0], { target: { value: 'week' } });
    expect((frequency[0] as HTMLInputElement).value).toBe('week');
  });
});
