import { fireEvent, getByTestId, render, screen } from '@testing-library/react';

import { AdjustableIncomeResults } from '.';

const mockData = {
  title: 'Adjustable income calculator',
  errorTitle: "There's been a problem",
  buttonText: 'Calculate',
  submittedButtonText: 'Recalculate',
  resultsButtonText: 'Apply changes',
  resultTitle: 'Your results',
  calloutMessage: <>Random calloutMessage</>,
  calloutMessageResults: <p>Callout results message</p>,
};

const mockUpdateMonth = {
  questionNbr: 1,
  group: 'NumberInput',
  answers: [],
  type: 'updateMonth',
  title: 'or try paying in a different amount each month:',
  errors: {
    required: 'Enter a figure',
    invalid: 'Use numbers only',
  },
};

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn().mockReturnValue({ updateMonth: 500 }),
    query: {
      language: 'en',
    },
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
  }),
}));

describe('AdjustableIncomeResults', () => {
  it('should render correctly', () => {
    const { container } = render(
      <AdjustableIncomeResults
        queryData={{ age: '56', language: 'en', pot: '100,000' }}
        data={mockData}
        fields={[]}
        onChange={jest.fn()}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should update result values when monthly income changes', () => {
    render(
      <AdjustableIncomeResults
        queryData={{ age: '56', language: 'en', pot: '100,000' }}
        data={mockData}
        fields={[mockUpdateMonth]}
        onChange={jest.fn()}
      />,
    );

    fireEvent.change(screen.getAllByTestId('updateMonth')[0], {
      target: { value: 500 },
    });

    expect(screen.getAllByDisplayValue(500).length).toBe(1);
  });

  it('should return 0 monthly income', () => {
    const { container } = render(
      <AdjustableIncomeResults
        queryData={{ age: '56', language: 'en', pot: '100' }}
        data={mockData}
        fields={[mockUpdateMonth]}
        onChange={jest.fn()}
      />,
    );
    const input: HTMLInputElement = getByTestId(container, 'updateMonth');

    expect(input.value).toBe('0');
  });

  it('should return query monthly income', () => {
    const { container } = render(
      <AdjustableIncomeResults
        queryData={{
          age: '56',
          language: 'en',
          pot: '10000',
          updateMonth: '25',
        }}
        data={mockData}
        fields={[mockUpdateMonth]}
        onChange={jest.fn()}
      />,
    );
    const input: HTMLInputElement = getByTestId(container, 'updateMonth');

    expect(input.value).toBe('25');
  });
});
