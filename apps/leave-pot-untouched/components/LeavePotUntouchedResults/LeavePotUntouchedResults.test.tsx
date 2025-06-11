import { fireEvent, render, screen } from '@testing-library/react';

import { LeavePotUntouchedResults } from './LeavePotUntouchedResults';

const mockLeavePotUntouchedData = {
  title: 'Leave Pot Untouched calculator',
  errorTitle: "There's been a problem",
  buttonText: 'Calculate',
  submittedButtonText: 'Recalculate',
  resultsButtonText: 'Apply changes',
  resultTitle: 'Your results',
  calloutMessage: <>Random calloutMessage</>,
  calloutMessageResults: <p>Callout results message</p>,
};

const mockUpdatedMockMonth = {
  errors: { required: 'Enter a figure', invalid: 'Use numbers only' },
  group: 'NumberInput',
  answers: [],
  questionNbr: 3,
  title: 'or try paying in a different amount each month:',
  type: 'updateMonth',
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

describe('LeavePotUntouchedResults', () => {
  it('should render correctly with default props', () => {
    const { container } = render(
      <LeavePotUntouchedResults
        queryData={{ language: 'en', pot: '100,000', month: '400' }}
        data={mockLeavePotUntouchedData}
        fields={[mockUpdatedMockMonth]}
        onChange={jest.fn()}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should update result values when monthly income changes', () => {
    render(
      <LeavePotUntouchedResults
        queryData={{ language: 'en', pot: '100,000', month: '400' }}
        data={mockLeavePotUntouchedData}
        fields={[mockUpdatedMockMonth]}
        onChange={jest.fn()}
      />,
    );

    const input: HTMLInputElement = screen.getByLabelText(
      'or try paying in a different amount each month:',
    );
    fireEvent.change(input, { target: { value: '500' } });

    expect(input.value).toBe('500');
  });
});
