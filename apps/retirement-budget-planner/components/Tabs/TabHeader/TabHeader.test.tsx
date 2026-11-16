import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { Tab } from '../../../lib/types/tabs.type';
import { TabHeader } from './TabHeader';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => {
  const mockUseTranslation = () => ({
    t: (id: string) => {
      return [{ key: 'tabs.tab1', value: 'About me' }].map(({ key, value }) => {
        if (key === id) return value;
      });
    },
    tList: () => [],
    locale: 'en',
  });
  return {
    __esModule: true,
    default: mockUseTranslation,
    useTranslation: mockUseTranslation,
  };
});

describe('TabHeader', () => {
  const mockTab: Tab = {
    step: 1,
    tabName: 'tab1',
  };

  const defaultProps = {
    tab: mockTab,
    index: 0,
    enabledTabCount: 2,
    activeTabId: 'tab1',
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should renders the tab title', () => {
    render(<TabHeader {...defaultProps} />);
    expect(screen.getByRole('button')).toHaveTextContent('About me');
  });

  it('should render tab with correct formaction attribute', () => {
    render(<TabHeader {...defaultProps} />);
    expect(screen.getByRole('button')).toHaveAttribute(
      'formaction',
      '/api/submit?stepName=tab1&stepsEnabled=2',
    );
  });

  it('sets aria-current to step when active', () => {
    render(<TabHeader {...defaultProps} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-current', 'step');
  });

  it('does not set aria-current when not active', () => {
    render(<TabHeader {...defaultProps} activeTabId="tab2" />);
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-current');
  });

  it('sets tabIndex to 0 when enabled', () => {
    render(<TabHeader {...defaultProps} />);
    expect(screen.getByRole('button')).toHaveAttribute('tabIndex', '0');
  });

  it('sets tabIndex to -1 when disabled', () => {
    render(<TabHeader {...defaultProps} index={3} enabledTabCount={2} />);
    expect(screen.getByRole('button')).toHaveAttribute('tabIndex', '-1');
  });

  it('calls onClick when enabled and clicked', () => {
    render(<TabHeader {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(defaultProps.onClick).toHaveBeenCalled();
  });

  it('does not call onClick when disabled and clicked', () => {
    render(<TabHeader {...defaultProps} index={3} enabledTabCount={2} />);
    fireEvent.click(screen.getByRole('button'));
    expect(defaultProps.onClick).not.toHaveBeenCalled();
  });
});
