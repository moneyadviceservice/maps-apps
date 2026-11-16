import {
  fireEvent,
  getByTestId,
  queryAllByText,
  render,
  screen,
} from '@testing-library/react';

import { CashInChunksResults } from './CashInChunksResults';
import { mockData, mockQuestions } from './mockData';

const mockQueryData = {
  income: '10000',
  pot: '100000',
  chunk: '1000',
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

describe('CashInChunksResults', () => {
  it('should render correctly', () => {
    const { container } = render(
      <CashInChunksResults
        queryData={mockQueryData}
        fields={mockQuestions}
        data={mockData}
        onChange={jest.fn()}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should not render with empty queryData', () => {
    const { container } = render(
      <CashInChunksResults
        queryData={{}}
        fields={mockQuestions}
        data={mockData}
        onChange={jest.fn()}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should update values when updateChunk field is changed', () => {
    const { container } = render(
      <CashInChunksResults
        queryData={mockQueryData}
        fields={mockQuestions}
        data={mockData}
        onChange={jest.fn()}
      />,
    );

    expect(queryAllByText(container, '£99,000')).toHaveLength(1);

    fireEvent.change(screen.getAllByTestId('updateChunk')[0], {
      target: { value: '2000' },
    });
    const input = getByTestId(container, 'updateChunk');

    expect((input as HTMLInputElement).value).toBe('2,000');
  });

  it('should return whole pot when updateChunk field is changed to 0', () => {
    const { container } = render(
      <CashInChunksResults
        queryData={mockQueryData}
        fields={mockQuestions}
        data={mockData}
        onChange={jest.fn()}
      />,
    );

    expect(screen.queryAllByText('£99,000')).toHaveLength(1);

    fireEvent.change(screen.getAllByTestId('updateChunk')[0], {
      target: { value: '0' },
    });

    const updateChunk = getByTestId(container, 'updateChunk');
    expect((updateChunk as HTMLInputElement).value).toBe('0');
  });
});
