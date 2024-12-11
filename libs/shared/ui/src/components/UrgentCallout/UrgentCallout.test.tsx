import React from 'react';

import { render, screen } from '@testing-library/react';

import { UrgentCallout } from '.';

describe('UrgentCallout component', () => {
  it('renders with an arrow', () => {
    render(
      <UrgentCallout className="testClassName" variant="arrow">
        children
      </UrgentCallout>,
    );
    const callout = screen.getByTestId('urgent-callout');
    expect(callout).toMatchSnapshot();
  });

  it('renders with a calculator', () => {
    render(
      <UrgentCallout className="testClassName" variant="calculator">
        children
      </UrgentCallout>,
    );

    const callout = screen.getByTestId('urgent-callout');
    expect(callout).toMatchSnapshot();
  });

  it('renders with a warning', () => {
    render(
      <UrgentCallout className="testClassName" variant="warning">
        children
      </UrgentCallout>,
    );

    const callout = screen.getByTestId('urgent-callout');
    expect(callout).toMatchSnapshot();
  });

  it('renders with an arrow and teal border', () => {
    render(
      <UrgentCallout className="testClassName" variant="arrow" border="teal">
        children
      </UrgentCallout>,
    );
    const callout = screen.getByTestId('urgent-callout');
    expect(callout).toMatchSnapshot();
  });

  it('renders with a calculator and teal border', () => {
    render(
      <UrgentCallout
        className="testClassName"
        variant="calculator"
        border="teal"
      >
        children
      </UrgentCallout>,
    );

    const callout = screen.getByTestId('urgent-callout');
    expect(callout).toMatchSnapshot();
  });

  it('renders with a warning and teal border', () => {
    render(
      <UrgentCallout className="testClassName" variant="warning" border="teal">
        children
      </UrgentCallout>,
    );

    const callout = screen.getByTestId('urgent-callout');
    expect(callout).toMatchSnapshot();
  });

  it('adds className and style correctly', () => {
    render(
      <UrgentCallout
        variant="warning"
        style={{ color: 'blue' }}
        className="testClassName"
      >
        children
      </UrgentCallout>,
    );

    const callout = screen.getByTestId('urgent-callout');
    expect(callout).toMatchSnapshot();
  });
});
