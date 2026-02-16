import React from 'react';

import { render, screen } from '@testing-library/react';

import { Callout, CalloutVariant } from '.';

import '@testing-library/jest-dom';

describe('Callout component', () => {
  it('renders the default variant correctly', () => {
    render(<Callout testId="test">Callout</Callout>);
    const container = screen.getByTestId('callout-default-test');
    expect(container).toMatchSnapshot();
  });

  it('renders the positive variant correctly', () => {
    render(
      <Callout variant={CalloutVariant.POSITIVE} testId="test">
        Callout
      </Callout>,
    );
    const container = screen.getByTestId('callout-positive-test');
    expect(container).toMatchSnapshot();
  });

  it('renders the warning variant correctly', () => {
    render(
      <Callout variant={CalloutVariant.WARNING} testId="test">
        Callout
      </Callout>,
    );
    const container = screen.getByTestId('callout-warning-test');
    expect(container).toMatchSnapshot();
  });

  it('renders the negative variant correctly', () => {
    render(
      <Callout variant={CalloutVariant.NEGATIVE} testId="test">
        Callout
      </Callout>,
    );
    const container = screen.getByTestId('callout-negative-test');
    expect(container).toMatchSnapshot();
  });

  it('renders the information variant correctly', () => {
    render(
      <Callout variant={CalloutVariant.INFORMATION} testId="test">
        Callout
      </Callout>,
    );
    const container = screen.getByTestId('callout-information-test');
    expect(container).toMatchSnapshot();
  });

  it('renders the white variant correctly', () => {
    render(
      <Callout variant={CalloutVariant.WHITE} testId="test">
        Callout
      </Callout>,
    );
    const container = screen.getByTestId('callout-white-test');
    expect(container).toMatchSnapshot();
  });

  it('renders the information_magenta variant correctly', () => {
    render(
      <Callout variant={CalloutVariant.INFORMATION_MAGENTA} testId="test">
        Callout
      </Callout>,
    );
    const container = screen.getByTestId('callout-information-magenta-test');
    expect(container).toMatchSnapshot();
  });

  it('renders the information-teal variant correctly', () => {
    render(
      <Callout variant={CalloutVariant.INFORMATION_TEAL} testId="test">
        Callout
      </Callout>,
    );
    const container = screen.getByTestId('callout-information-teal-test');
    expect(container).toMatchSnapshot();
  });

  it('renders with no variant prop', () => {
    render(<Callout testId="test">Default Callout</Callout>);
    const container = screen.getByTestId('callout-default-test');
    expect(container).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
