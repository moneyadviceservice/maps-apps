import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { CustomWebChatLink } from '.';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

interface GenesysMock extends jest.Mock {
  subscribe: jest.Mock<void, [string, () => void]>;
}

const Genesys = jest.fn() as GenesysMock;

// Define the mock implementation for the subscribe method
Genesys.subscribe = jest.fn((eventType, callback) => {
  if (eventType === 'Messenger.opened') {
    callback(); // Call the callback to simulate the behavior
  }
});

global.Genesys = Genesys;

const DummyWebChat = () => (
  <div id="genesys-mxg-frame" className="hidden">
    dummy web chat
  </div>
);

describe('CustomWebChatLink component', () => {
  it('renders correctly', () => {
    render(
      <>
        <DummyWebChat />
        <CustomWebChatLink className="gap-0" testId="test-custom-web-chat" />
      </>,
    );
    const container = screen.getByTestId('test-custom-web-chat');
    expect(container.innerHTML).toContain('Start webchat');
    expect(container).toMatchSnapshot();
  });

  it('renders correctly when webchat is open', () => {
    render(
      <>
        <DummyWebChat />
        <CustomWebChatLink className="gap-0" testId="test-custom-web-chat" />
      </>,
    );
    const container = screen.getByTestId('test-custom-web-chat');
    fireEvent.click(container);
    expect(container.innerHTML).toContain('Close webchat');
    expect(container).toMatchSnapshot();
  });
});
