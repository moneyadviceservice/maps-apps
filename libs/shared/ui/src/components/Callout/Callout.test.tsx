import React from 'react';

import { render, screen } from '@testing-library/react';

import { Callout } from '.';

describe('Callout component', () => {
  test.each([
    ['renders with an arrow', 'arrow'],
    ['renders with a calculator', 'calculator'],
    ['renders with a warning', 'warning'],
    ['renders with a mortgage variant', 'mortgage'],
  ] as const)('%s', (_testName, variant) => {
    render(
      <Callout className="testClassName" variant={variant}>
        children
      </Callout>,
    );
    const callout = screen.getByTestId('callout');
    expect(callout).toMatchSnapshot();
  });

  test.each([
    ['renders with an arrow and teal border', 'arrow'],
    ['renders with a calculator and teal border', 'calculator'],
    ['renders with a warning and teal border', 'warning'],
  ] as const)('%s', (_testName, variant) => {
    render(
      <Callout className="testClassName" variant={variant} border="teal">
        children
      </Callout>,
    );
    const callout = screen.getByTestId('callout');
    expect(callout).toMatchSnapshot();
  });

  it('adds className and style correctly', () => {
    render(
      <Callout
        variant="warning"
        style={{ color: 'blue' }}
        className="testClassName"
      >
        children
      </Callout>,
    );
    const callout = screen.getByTestId('callout');
    expect(callout).toMatchSnapshot();
  });

  it('renders null when variant is invalid', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const { container } = render(
      // @ts-expect-error - Testing invalid prop
      <Callout className="testClassName" variant="invalid">
        children
      </Callout>,
    );
    expect(container).toMatchSnapshot();
    consoleWarnSpy.mockRestore();
  });

  it('renders null when variant is null', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const { container } = render(
      // @ts-expect-error - Testing null prop
      <Callout className="testClassName" variant={null}>
        children
      </Callout>,
    );
    expect(container).toMatchSnapshot();
    consoleWarnSpy.mockRestore();
  });

  it('renders null when variant is undefined', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const { container } = render(
      // @ts-expect-error - Testing undefined prop
      <Callout className="testClassName">children</Callout>,
    );
    expect(container).toMatchSnapshot();
    consoleWarnSpy.mockRestore();
  });

  it('renders with custom testId', () => {
    render(
      <Callout
        className="testClassName"
        variant="warning"
        testId="custom-test-id"
      >
        children
      </Callout>,
    );
    const callout = screen.getByTestId('custom-test-id');
    expect(callout).toMatchSnapshot();
  });

  it('renders with complex children correctly', () => {
    render(
      <Callout className="testClassName" variant="calculator">
        <div data-testid="complex-child">
          <h3>Title</h3>
          <p>Description</p>
        </div>
      </Callout>,
    );
    const callout = screen.getByTestId('callout');
    expect(callout).toMatchSnapshot();
  });
});
