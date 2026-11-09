import { render } from '@testing-library/react';

import { TakeWholePotResults } from './TakeWholePotResults';

const mockData = {
  title: 'Take your whole pot | Pension Wise',
  information:
    'When you reach the age of 55, you may be able to take your entire pension pot as one lump sum. Call 0800 011 3797 for free guidance from one of our pension experts',
  calloutMessage: 'This is a callout message',
  calloutMessageResults: 'This is a callout message for results',
  errorTitle: 'Error',
  buttonText: 'Continue',
  submittedButtonText: 'Submitted',
  resultsButtonText: 'Results',
  resultTitle: 'Results',
};

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: {
      language: 'en',
    },
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
  }),
}));

describe('TakeWholePotResults', () => {
  it('should render results component correctly', () => {
    const { container } = render(
      <TakeWholePotResults
        queryData={{ income: '10000', pot: '100000' }}
        data={mockData}
      />,
    );

    expect(container).toMatchSnapshot();
  });
});
