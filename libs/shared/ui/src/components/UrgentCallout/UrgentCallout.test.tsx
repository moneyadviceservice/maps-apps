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

  it('renders with a mortgage variant', () => {
    render(
      <UrgentCallout className="testClassName" variant="mortgage">
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

  it('renders null when variant is invalid', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const { container } = render(
      // @ts-expect-error - Testing invalid prop
      <UrgentCallout className="testClassName" variant="invalid">
        children
      </UrgentCallout>,
    );
    expect(container).toMatchSnapshot();
    consoleWarnSpy.mockRestore();
  });

  it('renders null when variant is null', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const { container } = render(
      // @ts-expect-error - Testing null prop
      <UrgentCallout className="testClassName" variant={null}>
        children
      </UrgentCallout>,
    );
    expect(container).toMatchSnapshot();
    consoleWarnSpy.mockRestore();
  });

  it('renders null when variant is undefined', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const { container } = render(
      // @ts-expect-error - Testing undefined prop
      <UrgentCallout className="testClassName">children</UrgentCallout>,
    );
    expect(container).toMatchSnapshot();
    consoleWarnSpy.mockRestore();
  });

  it('renders with custom testId', () => {
    render(
      <UrgentCallout
        className="testClassName"
        variant="warning"
        testId="custom-test-id"
      >
        children
      </UrgentCallout>,
    );
    const callout = screen.getByTestId('custom-test-id');
    expect(callout).toMatchSnapshot();
  });

  it('renders with complex children correctly', () => {
    render(
      <UrgentCallout className="testClassName" variant="calculator">
        <div data-testid="complex-child">
          <h3>Title</h3>
          <p>Description</p>
        </div>
      </UrgentCallout>,
    );
    const callout = screen.getByTestId('urgent-callout');
    expect(callout).toMatchSnapshot();
  });
});
