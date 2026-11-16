import React from 'react';

import { useRouter } from 'next/router';

import { getAllByRole, render, screen } from '@testing-library/react';

import { buildHref, SocialShareTool } from '../SocialShareTool';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('SocialShareTool component', () => {
  it('renders correctly', () => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { language: 'en' },
      pathname: '/',
    });

    const { container } = render(
      <SocialShareTool
        url="https://example.com"
        title="Share this tool"
        subject="moneyhelper"
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('returns the link as-is for unknown share types (default case)', () => {
    const link = 'https://example.com';
    const name = 'unknown';
    const subject = 'Test Subject';
    const emailBodyText = 'Some text';

    const result = buildHref(link, name, subject, emailBodyText);

    expect(result).toBe(link);
  });

  it('renders divider when withDivider is true', () => {
    render(
      <SocialShareTool
        url="https://example.com"
        title="Share this tool"
        subject="moneyhelper"
        withDivider={true}
      />,
    );
    const dividers = getAllByRole(document.body, 'separator');
    expect(dividers.length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('social-divider').length).toBeGreaterThan(0);
  });
});
