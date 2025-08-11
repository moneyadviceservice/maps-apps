import React from 'react';

import { render } from '@testing-library/react';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import styles from './styles/widget.module.scss';
import { ToolFeedback } from './ToolFeedback';
declare global {
  interface Window {
    informizelyApi?: {
      showScript: (surveyId: string) => void;
    };
  }
}

jest.mock('@maps-react/hooks/useTranslation');

describe('ToolFeedback component', () => {
  const setupMockApi = () => {
    const mockShowScript = jest.fn();
    window.informizelyApi = {
      showScript: mockShowScript,
    };
    return mockShowScript;
  };

  const setupTest = (locale: 'en' | 'cy', isProduction = false) => {
    jest.useFakeTimers();
    const originalEnv = process.env.NEXT_PUBLIC_ENVIRONMENT;
    process.env.NEXT_PUBLIC_ENVIRONMENT = isProduction
      ? 'production'
      : 'development';

    const mockShowScript = setupMockApi();

    (useTranslation as jest.Mock).mockReturnValue({
      locale,
    });

    return { mockShowScript, originalEnv };
  };

  const cleanupTest = (originalEnv?: string) => {
    jest.useRealTimers();
    if (originalEnv !== undefined) {
      process.env.NEXT_PUBLIC_ENVIRONMENT = originalEnv;
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default survey IDs (en)', () => {
    (useTranslation as jest.Mock).mockReturnValue({
      locale: 'en',
    });

    const { container } = render(<ToolFeedback />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with default survey IDs (cy)', () => {
    (useTranslation as jest.Mock).mockReturnValue({
      locale: 'cy',
    });

    const { container } = render(<ToolFeedback />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with custom survey IDs', () => {
    (useTranslation as jest.Mock).mockReturnValue({
      locale: 'en',
    });

    const customSurveyIds = {
      production: {
        en: 'custom-en-prod-id',
        cy: 'custom-cy-prod-id',
      },
      development: {
        en: 'custom-en-dev-id',
        cy: 'custom-cy-dev-id',
      },
    };

    const { container } = render(<ToolFeedback surveyIds={customSurveyIds} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('applies custom className correctly', () => {
    (useTranslation as jest.Mock).mockReturnValue({
      locale: 'en',
    });

    const { container } = render(<ToolFeedback className="test-class" />);
    expect(
      (container.firstChild as HTMLElement).classList.contains('test-class'),
    ).toBe(true);
  });

  it('calls informizelyApi.showScript with correct survey ID when API is available', () => {
    const { mockShowScript } = setupTest('en');

    render(<ToolFeedback />);
    jest.advanceTimersByTime(500);

    expect(mockShowScript).toHaveBeenCalledWith('fjguluwfj');
    cleanupTest();
  });

  it('uses production survey IDs when NEXT_PUBLIC_ENVIRONMENT is production', () => {
    const { mockShowScript, originalEnv } = setupTest('en', true);

    render(<ToolFeedback />);
    jest.advanceTimersByTime(500);

    expect(mockShowScript).toHaveBeenCalledWith('fgddnriui');
    cleanupTest(originalEnv);
  });

  it('does not call informizelyApi.showScript when API is not available', () => {
    jest.useFakeTimers();
    window.informizelyApi = undefined;

    (useTranslation as jest.Mock).mockReturnValue({
      locale: 'en',
    });

    render(<ToolFeedback />);

    jest.advanceTimersByTime(500);

    expect(window.informizelyApi).toBeUndefined();
    jest.useRealTimers();
  });

  it('clears timeout on component unmount', () => {
    jest.useFakeTimers();
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    (useTranslation as jest.Mock).mockReturnValue({
      locale: 'en',
    });

    const { unmount } = render(<ToolFeedback />);
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
    jest.useRealTimers();
  });

  it('works with Welsh locale in production', () => {
    const { mockShowScript, originalEnv } = setupTest('cy', true);

    render(<ToolFeedback />);
    jest.advanceTimersByTime(500);

    expect(mockShowScript).toHaveBeenCalledWith('ugeryrudd');
    cleanupTest(originalEnv);
  });

  it('works with Welsh locale in development', () => {
    const { mockShowScript } = setupTest('cy');

    render(<ToolFeedback />);
    jest.advanceTimersByTime(500);

    expect(mockShowScript).toHaveBeenCalledWith('zjiieufr');
    cleanupTest();
  });

  it('applies overrideIzCr class when overrideIzCr is true', () => {
    const { container } = render(<ToolFeedback overrideIzCr={true} />);
    const div = container.firstChild as HTMLElement;

    expect(div.className).toContain(styles.overrideIzCr);
  });

  it('does not apply overrideIzCr class when overrideIzCr is false', () => {
    const { container } = render(<ToolFeedback overrideIzCr={false} />);
    const div = container.firstChild as HTMLElement;
    expect(div.className).not.toContain(styles.overrideIzCr);
  });
});
