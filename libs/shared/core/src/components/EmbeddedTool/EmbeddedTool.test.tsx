import React from 'react';

import { render, screen } from '@testing-library/react';

import { EmbeddedTool } from '.';

import '@testing-library/jest-dom/extend-expect';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('Embedded Tool component', () => {
  it('renders correctly', () => {
    render(
      <EmbeddedTool
        toolData={{
          url: {
            en: 'https://dev-moneyhelper-tools.azurewebsites.net/en/leave-pot-untouched',
            cy: 'https://dev-moneyhelper-tools.azurewebsites.net/cy/leave-pot-untouched',
          },
          api: 'https://dev-moneyhelper-tools.azurewebsites.net/api/embed',
          id: 'leave-pot-untouched',
        }}
        testId="test-component"
      />,
    );
    const container = screen.getByTestId('test-component');
    expect(container).toMatchSnapshot();
  });

  it('renders correctly with default id', () => {
    render(
      <EmbeddedTool
        toolData={{
          url: {
            en: 'https://dev-moneyhelper-tools.azurewebsites.net/en/leave-pot-untouched',
            cy: 'https://dev-moneyhelper-tools.azurewebsites.net/cy/leave-pot-untouched',
          },
          api: 'https://dev-moneyhelper-tools.azurewebsites.net/api/embed',
          id: 'leave-pot-untouched',
        }}
      />,
    );
    const container = screen.getByTestId('iframe');
    expect(container).toMatchSnapshot();
  });
});
