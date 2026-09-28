import React from 'react';

import { render, screen } from '@testing-library/react';

import { NotificationBox, NotificationBoxVariant } from '.';

import '@testing-library/jest-dom';

describe('NotificationBox component', () => {
  it('renders the default variant correctly', () => {
    render(<NotificationBox testId="test">Callout</NotificationBox>);
    const container = screen.getByTestId('notification-box-default-test');
    expect(container).toMatchSnapshot();
  });

  it('renders the positive variant correctly', () => {
    render(
      <NotificationBox variant={NotificationBoxVariant.POSITIVE} testId="test">
        Callout
      </NotificationBox>,
    );
    const container = screen.getByTestId('notification-box-positive-test');
    expect(container).toMatchSnapshot();
  });

  it('renders the warning variant correctly', () => {
    render(
      <NotificationBox variant={NotificationBoxVariant.WARNING} testId="test">
        Callout
      </NotificationBox>,
    );
    const container = screen.getByTestId('notification-box-warning-test');
    expect(container).toMatchSnapshot();
  });

  it('renders the negative variant correctly', () => {
    render(
      <NotificationBox variant={NotificationBoxVariant.NEGATIVE} testId="test">
        Callout
      </NotificationBox>,
    );
    const container = screen.getByTestId('notification-box-negative-test');
    expect(container).toMatchSnapshot();
  });

  it('renders the information variant correctly', () => {
    render(
      <NotificationBox
        variant={NotificationBoxVariant.INFORMATION}
        testId="test"
      >
        Callout
      </NotificationBox>,
    );
    const container = screen.getByTestId('notification-box-information-test');
    expect(container).toMatchSnapshot();
  });

  it('renders the white variant correctly', () => {
    render(
      <NotificationBox variant={NotificationBoxVariant.WHITE} testId="test">
        Callout
      </NotificationBox>,
    );
    const container = screen.getByTestId('notification-box-white-test');
    expect(container).toMatchSnapshot();
  });

  it('renders the information_magenta variant correctly', () => {
    render(
      <NotificationBox
        variant={NotificationBoxVariant.INFORMATION_MAGENTA}
        testId="test"
      >
        Callout
      </NotificationBox>,
    );
    const container = screen.getByTestId(
      'notification-box-information-magenta-test',
    );
    expect(container).toMatchSnapshot();
  });

  it('renders the information-teal variant correctly', () => {
    render(
      <NotificationBox
        variant={NotificationBoxVariant.INFORMATION_TEAL}
        testId="test"
      >
        Callout
      </NotificationBox>,
    );
    const container = screen.getByTestId(
      'notification-box-information-teal-test',
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with no variant prop', () => {
    render(<NotificationBox testId="test">Default Callout</NotificationBox>);
    const container = screen.getByTestId('notification-box-default-test');
    expect(container).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
