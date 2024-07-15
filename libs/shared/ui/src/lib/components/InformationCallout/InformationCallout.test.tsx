import React from 'react';
import { render, screen } from '@testing-library/react';
import { InformationCallout } from '.';

describe('InformationCallout component', () => {
  it('renders correctly', () => {
    render(
      <InformationCallout>
        <div>Information callout</div>
      </InformationCallout>,
    );
    const callout = screen.getByTestId('information-callout');
    expect(callout).toMatchSnapshot();
  });

  it('renders correctly with shadow', () => {
    render(
      <InformationCallout variant="withShadow">
        <div>Information callout</div>
      </InformationCallout>,
    );
    const callout = screen.getByTestId('information-callout');
    expect(callout).toMatchSnapshot();
  });
});
