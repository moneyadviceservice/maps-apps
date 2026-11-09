import { render } from '@testing-library/react';

import { PensionPotGuaranteedIncomeResults } from './PensionPotGuaranteedIncomeResults';
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

const mockQueryData = {
  pot: '100000',
  age: '65',
};
export const mockData = {
  title: 'Guaranteed income Calculator',
  errorTitle: "There's been a problem",
  buttonText: 'Calculate',
  submittedButtonText: 'Recalculate',
  resultsButtonText: 'Apply changes',
  resultTitle: 'Your results',
};

describe('PensionPotGuaranteedIncomeResults', () => {
  it('should render correctly', () => {
    const { container } = render(
      <PensionPotGuaranteedIncomeResults
        queryData={mockQueryData}
        data={mockData}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
