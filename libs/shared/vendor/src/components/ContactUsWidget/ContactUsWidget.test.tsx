import Script from 'next/script';

import { render } from '@testing-library/react';

import { ContactUsWidget } from './';

import '@testing-library/jest-dom';

jest.mock('next/script', () => {
  return jest.fn(() => null);
});

const MockScript = Script as jest.Mock;

describe('ContactUsWidget', () => {
  const mockInit = jest.fn();

  beforeEach(() => {
    MockScript.mockClear();
    mockInit.mockClear();
    (window as Window).ContactUsWidget = {
      init: mockInit,
    };
  });

  afterEach(() => {
    delete (window as Window).ContactUsWidget;
  });

  it('should render script tag with correct props', () => {
    render(
      <ContactUsWidget
        src="https://example.com/widget.js"
        deploymentId={{
          en: 'test-deployment-id-en',
          cy: 'test-deployment-id-cy',
        }}
      />,
    );

    expect(MockScript).toHaveBeenCalledTimes(1);
    expect(MockScript).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'contact-us-widget',
        src: 'https://example.com/widget.js',
        strategy: 'afterInteractive',
        'data-testid': 'contact-us-widget',
      }),
      {},
    );
  });

  it('should call ContactUsWidget.init with default environment on load', () => {
    render(
      <ContactUsWidget
        src="https://example.com/widget.js"
        deploymentId={{
          en: 'test-deployment-id-en',
          cy: 'test-deployment-id-cy',
        }}
      />,
    );

    const onLoadCallback = MockScript.mock.calls[0][0].onLoad;
    onLoadCallback();

    expect(mockInit).toHaveBeenCalledWith({
      deploymentId: {
        en: 'test-deployment-id-en',
        cy: 'test-deployment-id-cy',
      },
      environment: 'euw2',
    });
  });

  it('should call ContactUsWidget.init with custom environment on load', () => {
    render(
      <ContactUsWidget
        src="https://example.com/widget.js"
        deploymentId={{
          en: 'test-deployment-id-en',
          cy: 'test-deployment-id-cy',
        }}
        environment="custom-env"
      />,
    );

    const onLoadCallback = MockScript.mock.calls[0][0].onLoad;
    onLoadCallback();

    expect(mockInit).toHaveBeenCalledWith({
      deploymentId: {
        en: 'test-deployment-id-en',
        cy: 'test-deployment-id-cy',
      },
      environment: 'custom-env',
    });
  });

  it('should not throw if ContactUsWidget is not defined on window', () => {
    delete (window as Window).ContactUsWidget;

    render(
      <ContactUsWidget
        src="https://example.com/widget.js"
        deploymentId={{
          en: 'test-deployment-id-en',
          cy: 'test-deployment-id-cy',
        }}
      />,
    );

    const onLoadCallback = MockScript.mock.calls[0][0].onLoad;

    expect(() => onLoadCallback()).not.toThrow();
    expect(mockInit).not.toHaveBeenCalled();
  });

  it('should not render if deploymentId.en is missing', () => {
    render(
      <ContactUsWidget
        src="https://example.com/widget.js"
        deploymentId={{ en: '', cy: 'test-deployment-id-cy' }}
      />,
    );

    expect(MockScript).not.toHaveBeenCalled();
  });

  it('should not render if deploymentId.cy is missing', () => {
    render(
      <ContactUsWidget
        src="https://example.com/widget.js"
        deploymentId={{ en: 'test-deployment-id-en', cy: '' }}
      />,
    );

    expect(MockScript).not.toHaveBeenCalled();
  });

  it('should not render if deploymentId is undefined', () => {
    render(<ContactUsWidget src="https://example.com/widget.js" />);

    expect(MockScript).not.toHaveBeenCalled();
  });
});
