import Script from 'next/script';

import { render, screen } from '@testing-library/react';

import { TRUSTPILOT_SCRIPT_SRC, TrustpilotWidget } from '.';

import '@testing-library/jest-dom';

jest.mock('next/script', () =>
  jest.fn(({ onLoad }: { onLoad?: () => void }) => {
    onLoad?.();
    return null;
  }),
);

const mockScript = Script as jest.MockedFunction<typeof Script>;

describe('TrustpilotWidget', () => {
  const originalTrustpilot = window.Trustpilot;

  beforeEach(() => {
    mockScript.mockClear();
  });

  afterEach(() => {
    window.Trustpilot = originalTrustpilot;
  });

  it('renders the widget container and Trustpilot review link', () => {
    render(<TrustpilotWidget />);

    expect(screen.getByTestId('trustpilot-widget')).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: 'Trustpilot rating for MoneyHelper. Opens in a new tab',
      }),
    ).toHaveAttribute(
      'href',
      'https://uk.trustpilot.com/review/www.moneyhelper.org.uk',
    );
  });

  it('exports the Trustpilot bootstrap script URL', () => {
    expect(TRUSTPILOT_SCRIPT_SRC).toBe(
      'https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js',
    );
  });

  it('loads the Trustpilot bootstrap script', () => {
    render(<TrustpilotWidget />);

    expect(mockScript).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'trustpilot-bootstrap',
        src: TRUSTPILOT_SCRIPT_SRC,
      }),
      undefined,
    );
  });

  it('loads the widget from the element when Trustpilot is available', () => {
    const loadFromElement = jest.fn();
    window.Trustpilot = { loadFromElement };

    render(<TrustpilotWidget />);

    expect(loadFromElement).toHaveBeenCalledWith(
      screen.getByTestId('trustpilot-widget'),
      true,
    );
  });

  it('does not throw when Trustpilot is unavailable', () => {
    delete window.Trustpilot;

    expect(() => render(<TrustpilotWidget />)).not.toThrow();
    expect(screen.getByTestId('trustpilot-widget')).toBeInTheDocument();
  });
});
