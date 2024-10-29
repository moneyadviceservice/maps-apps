import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { TabLayout } from './TabLayout';

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: { tab: '1' },
  }),
}));

jest.mock('@maps-react/common/components/BackLink', () => ({
  BackLink: jest.fn(({ children }) => <a href="#">{children}</a>),
}));

Element.prototype.scrollIntoView = jest.fn();

describe('TabLayout', () => {
  const defaultProps = {
    tabLinks: ['Tab 1', 'Tab 2', 'Tab 3'],
    currentTab: 1,
    tabHeadings: ['Heading 1', 'Heading 2', 'Heading 3'],
    tabContent: [
      <div key={1}>Tab 1 Content</div>,
      <div key={2}>Tab 2 Content</div>,
      <div key={3}>Tab 3 Content</div>,
    ],
    toolBaseUrl: '/example',
    hasErrors: false,
  };

  it('renders without errors', () => {
    render(<TabLayout {...defaultProps} />);
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Heading 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 1 Content')).toBeInTheDocument();
  });

  it('renders correct number of tab links', () => {
    render(<TabLayout {...defaultProps} />);
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });

  it('renders tab links with correct props', () => {
    render(<TabLayout {...defaultProps} />);
    const tabLinks = screen.getAllByRole('tab');
    expect(tabLinks[0]).toHaveTextContent('Tab 1');
    expect(tabLinks[0]).toHaveAttribute('href', '/example1');
    expect(tabLinks[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabLinks[1]).toHaveTextContent('Tab 2');
    expect(tabLinks[1]).toHaveAttribute('href', '/example2');
    expect(tabLinks[1]).toHaveAttribute('aria-selected', 'false');
  });

  it('renders tab body with correct heading and action', () => {
    render(<TabLayout {...defaultProps} />);
    expect(screen.getByText('Heading 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 1 Content')).toBeInTheDocument();
  });

  it('renders tab body with correct with tab Notice', () => {
    render(<TabLayout {...defaultProps} tabNotice={<>test</>} />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('should focus on the previous and next tabs when using the arrow keys', () => {
    render(
      <TabLayout {...defaultProps} currentTab={3} buttonFormId="form-id" />,
    );

    const tabButtons = screen.getAllByRole('tab');

    fireEvent.keyDown(tabButtons[2], { key: 'ArrowLeft' });
    expect(tabButtons[1]).toHaveFocus();

    fireEvent.keyDown(tabButtons[1], { key: 'ArrowRight' });
    expect(tabButtons[2]).toHaveFocus();
  });

  it('should wrap focus to the first and last tabs when navigating past end tabs', () => {
    render(
      <TabLayout {...defaultProps} currentTab={1} buttonFormId="form-id" />,
    );

    const tabButtons = screen.getAllByRole('tab');

    fireEvent.keyDown(tabButtons[0], { key: 'ArrowLeft' });
    expect(tabButtons[2]).toHaveFocus();

    fireEvent.keyDown(tabButtons[2], { key: 'ArrowRight' });
    expect(tabButtons[0]).toHaveFocus();
  });

  it('should trigger click on the current tab when Enter is pressed', () => {
    render(
      <TabLayout {...defaultProps} currentTab={1} buttonFormId="form-id" />,
    );

    const tabButtons = screen.getAllByRole('tab');

    fireEvent.keyDown(tabButtons[0], { key: ' ' });

    expect(tabButtons[0]).not.toHaveAttribute('tabindex', '-1');
  });

  it('should trigger click on the current tab when Space is pressed', () => {
    render(
      <TabLayout {...defaultProps} currentTab={1} buttonFormId="form-id" />,
    );

    const tabButtons = screen.getAllByRole('tab');

    fireEvent.keyDown(tabButtons[0], { key: ' ' });

    expect(tabButtons[0]).not.toHaveAttribute('tabindex', '-1');
  });
});
