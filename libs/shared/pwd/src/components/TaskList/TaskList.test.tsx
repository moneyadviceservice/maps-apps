import React from 'react';

import { render, screen } from '@testing-library/react';

import { TaskList } from '.';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('TaskList component', () => {
  it('renders correctly', () => {
    render(
      <TaskList
        tasks={['Task 1', 'Task 2', 'Task 3']}
        formAction="api/test"
        query={{
          language: 'en',
          t1: '4',
          t2: '3',
          t3: '2;',
        }}
        testId="test-component"
        enableLinks
      />,
    );
    const container = screen.getByTestId('test-component');
    expect(container).toMatchSnapshot();
  });

  it('renders notLaunched list correctly', () => {
    render(
      <TaskList
        tasks={['Task 1', 'Task 2', 'Task 3']}
        formAction="api/test"
        query={{
          language: 'en',
        }}
        testId="test-component"
        notLaunched
      />,
    );
    const container = screen.getByTestId('test-component');
    expect(container).toMatchSnapshot();
  });

  it('renders disabled links list correctly', () => {
    render(
      <TaskList
        tasks={['Task 1', 'Task 2', 'Task 3']}
        formAction="api/test"
        query={{
          language: 'en',
        }}
        testId="test-component"
      />,
    );
    const container = screen.getByTestId('test-component');
    expect(container).toMatchSnapshot();
  });
});
