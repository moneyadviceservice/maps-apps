import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { RubyIFrame } from '.';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('RubyIFrame component', () => {
  it('renders correctly', () => {
    render(
      <RubyIFrame
        toolData={{
          url: {
            en: 'https://embedded-journeys.moneyhelper.org.uk/en/leave-pot-untouched',
            cy: 'https://embedded-journeys.moneyhelper.org.uk/cy/leave-pot-untouched',
          },
          id: 'leave-pot-untouched',
        }}
        testId="test-component"
      />,
    );
    const container = screen.getByTestId('test-component');
    expect(container).toMatchSnapshot();
  });

  it('updates iframe height on MASRESIZE- message', async () => {
    render(
      <RubyIFrame
        toolData={{
          url: {
            en: 'https://embedded-journeys.moneyhelper.org.uk/en/leave-pot-untouched',
            cy: 'https://embedded-journeys.moneyhelper.org.uk/cy/leave-pot-untouched',
          },
          id: 'leave-pot-untouched',
        }}
      />,
    );
    const container = screen.getByTestId('iframe');

    window.dispatchEvent(
      new MessageEvent('message', {
        data: 'MASRESIZE-200',
      }),
    );

    await waitFor(() => {
      expect(container).toHaveAttribute('height', '200');
    });
  });
});
