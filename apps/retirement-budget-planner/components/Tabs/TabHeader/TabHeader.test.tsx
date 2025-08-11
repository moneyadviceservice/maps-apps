import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { Tab } from '../../../lib/types/tabs.type';
import { TabHeader } from './TabHeader';

import '@testing-library/jest-dom';

describe('TabHeader', () => {
  const mockTab: Tab = {
    step: 1,
    tabName: 'tab1',
    title: 'About me',
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
    expect(screen.getByRole('tab')).toHaveTextContent('About me');
  });

  it('sets aria-selected to true when active', () => {
    render(<TabHeader {...defaultProps} />);
    expect(screen.getByRole('tab')).toHaveAttribute('aria-selected', 'true');
  });

  it('sets aria-selected to false when not active', () => {
    render(<TabHeader {...defaultProps} activeTabId="tab2" />);
    expect(screen.getByRole('tab')).toHaveAttribute('aria-selected', 'false');
  });

  it('sets tabIndex to 0 when enabled', () => {
    render(<TabHeader {...defaultProps} />);
    expect(screen.getByRole('tab')).toHaveAttribute('tabIndex', '0');
  });

  it('sets tabIndex to -1 when disabled', () => {
    render(<TabHeader {...defaultProps} index={3} enabledTabCount={2} />);
    expect(screen.getByRole('tab')).toHaveAttribute('tabIndex', '-1');
  });

  it('calls onClick when enabled and clicked', () => {
    render(<TabHeader {...defaultProps} />);
    fireEvent.click(screen.getByRole('tab'));
    expect(defaultProps.onClick).toHaveBeenCalledWith('tab1', 0);
  });

  it('does not call onClick when disabled and clicked', () => {
    render(<TabHeader {...defaultProps} index={3} enabledTabCount={2} />);
    fireEvent.click(screen.getByRole('tab'));
    expect(defaultProps.onClick).not.toHaveBeenCalled();
  });
});
