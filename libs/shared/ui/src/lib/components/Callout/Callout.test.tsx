import React from 'react';
import { render, screen } from '@testing-library/react';
import { Callout, CalloutVariant } from '.';

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
});
