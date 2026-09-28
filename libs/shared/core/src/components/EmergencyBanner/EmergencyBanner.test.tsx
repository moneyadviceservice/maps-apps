import React from 'react';

import { render, screen } from '@testing-library/react';

import { EmergencyBanner } from './EmergencyBanner';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('EmergencyBanner component', () => {
  const defaultContent = {
    en: 'This is an emergency message',
    cy: 'Mae hyn yn neges argyfwng',
  };

  it('renders with text content correctly', () => {
    render(<EmergencyBanner content={defaultContent} />);

    const banner = screen.getByTestId('emergency-banner');
    expect(banner).toBeInTheDocument();
    expect(
      screen.getByText('This is an emergency message'),
    ).toBeInTheDocument();
    expect(banner).toMatchSnapshot();
  });

  it('renders with custom className', () => {
    const customClass = 'custom-test-class';
    render(
      <EmergencyBanner content={defaultContent} className={customClass} />,
    );

    const banner = screen.getByTestId('emergency-banner');
    expect(banner).toHaveClass(customClass);
  });

  it('renders warning icon', () => {
    render(<EmergencyBanner content={defaultContent} />);

    const banner = screen.getByTestId('emergency-banner');
    expect(banner).toMatchSnapshot();
  });

  it('renders with JSON content (English)', () => {
    const jsonContent = {
      en: 'This is an **emergency** message with [link](#)',
      cy: 'Mae hyn yn neges **argyfwng** gyda [dolen](#)',
    };

    render(<EmergencyBanner content={jsonContent} />);

    const banner = screen.getByTestId('emergency-banner');
    expect(screen.getByText('link')).toBeInTheDocument();
    expect(banner).toMatchSnapshot();
  });

  it('renders with JSON content with markdown formatting', () => {
    const jsonContent = {
      en: '- First item\n- Second item\n\nAdditional text',
      cy: '- Eitem gyntaf\n- Ail eitem\n\nTestun ychwanegol',
    };

    render(<EmergencyBanner content={jsonContent} />);

    const banner = screen.getByTestId('emergency-banner');
    expect(banner).toMatchSnapshot();
  });

  it('renders simple text content', () => {
    const simpleContent = {
      en: 'Simple emergency message',
      cy: 'Neges argyfwng syml',
    };

    render(<EmergencyBanner content={simpleContent} />);

    expect(screen.getByText('Simple emergency message')).toBeInTheDocument();
  });

  it('applies correct styling to links', () => {
    const contentWithLink = {
      en: 'Emergency message with [link](https://example.com)',
      cy: 'Neges argyfwng gyda [dolen](https://example.com)',
    };

    render(<EmergencyBanner content={contentWithLink} />);

    const link = screen.getByText('link');
    expect(link.tagName).toBe('A');
    expect(link).toHaveClass('underline');
  });
});
