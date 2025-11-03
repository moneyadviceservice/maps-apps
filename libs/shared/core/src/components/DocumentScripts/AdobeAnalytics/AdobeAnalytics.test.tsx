import Script from 'next/script';

import { render } from '@testing-library/react';

import { AdobeAnalytics } from './';

import '@testing-library/jest-dom';

jest.mock('next/script', () => {
  return jest.fn(() => null);
});

const MockScript = Script as jest.Mock;

describe('AdobeAnalytics', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    MockScript.mockClear();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should render the Script component with the correct src from environment variables', () => {
    const adobeScriptUrl = 'https://assets.adobedtm.com/test-script.js';
    process.env.NEXT_PUBLIC_ADOBE_ANALYTICS_SCRIPT = adobeScriptUrl;

    render(<AdobeAnalytics />);

    expect(MockScript).toHaveBeenCalledWith(
      expect.objectContaining({
        src: adobeScriptUrl,
        strategy: 'beforeInteractive',
        'data-testid': 'adobe-analytics',
      }),
      {},
    );
  });

  it('should pass the nonce prop to the Script component when provided', () => {
    const testNonce = 'nonce-for-testing-123';
    render(<AdobeAnalytics nonce={testNonce} />);

    expect(MockScript).toHaveBeenCalledWith(
      expect.objectContaining({
        nonce: testNonce,
      }),
      {},
    );
  });

  it('should not pass the nonce prop when it is not provided', () => {
    render(<AdobeAnalytics />);

    const props = MockScript.mock.calls[0][0];

    expect(props.nonce).toBeUndefined();
  });

  it('should render with an undefined src if the environment variable is not set', () => {
    process.env.NEXT_PUBLIC_ADOBE_ANALYTICS_SCRIPT = undefined;

    render(<AdobeAnalytics />);

    expect(MockScript).toHaveBeenCalledWith(
      expect.objectContaining({
        src: undefined,
      }),
      {},
    );
  });
});
