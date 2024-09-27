import '@testing-library/jest-dom';
import React from 'react';
import { fireEvent, getByText, render, screen } from '@testing-library/react';
import { Contact } from '.';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

const userClickEvent = (container: HTMLElement, text: string) => {
  return fireEvent(
    getByText(container, text),
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );
};

describe('Contact component', () => {
  it('renders correctly each step for pensions', () => {
    const { container } = render(<Contact />);

    userClickEvent(container, 'Talk to us live');

    expect(
      screen.getByText(/Talk to us live for.../i, { exact: false }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/pensions guidance/i, { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/money guidance/i, { exact: false }),
    ).toBeInTheDocument();

    userClickEvent(container, 'pensions guidance');

    expect(
      screen.getByText(/Talk to us live for pensions guidance using.../i, {
        exact: false,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Telephone/i, { exact: false }),
    ).toBeInTheDocument();

    userClickEvent(container, 'Telephone');

    expect(
      screen.getByText(
        /Talk to us live for pensions guidance using the telephone/i,
        { exact: false },
      ),
    ).toBeInTheDocument();

    userClickEvent(container, 'Previous');
    userClickEvent(container, 'Web form');
    expect(
      screen.getByText(/Talk to us for pensions guidance using our web form/i, {
        exact: false,
      }),
    ).toBeInTheDocument();
    userClickEvent(container, 'Previous');
    userClickEvent(container, 'Web chat');
    expect(
      screen.getByText(/Talk to us live for pensions guidance using webchat/i, {
        exact: false,
      }),
    ).toBeInTheDocument();
  });

  it('renders correctly each step for money', () => {
    const { container } = render(<Contact />);

    userClickEvent(container, 'Talk to us live');
    userClickEvent(container, 'money guidance');

    expect(
      screen.getByText(/Talk to us live for money guidance using.../i, {
        exact: false,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Telephone/i, { exact: false }),
    ).toBeInTheDocument();

    userClickEvent(container, 'Telephone');

    expect(
      screen.getByText(
        /Talk to us live for money guidance using the telephone/i,
        { exact: false },
      ),
    ).toBeInTheDocument();

    userClickEvent(container, 'Previous');
    userClickEvent(container, 'Web form');
    expect(
      screen.getByText(/Talk to us for money guidance using our web form/i, {
        exact: false,
      }),
    ).toBeInTheDocument();
    userClickEvent(container, 'Previous');
    userClickEvent(container, 'Web chat');
    expect(
      screen.getByText(/Talk to us live for money guidance using webchat/i, {
        exact: false,
      }),
    ).toBeInTheDocument();
    userClickEvent(container, 'Previous');
    userClickEvent(container, 'WhatsApp');
    expect(
      screen.getByText(/Talk to us live for money guidance using WhatsApp/i, {
        exact: false,
      }),
    ).toBeInTheDocument();
  });
});
