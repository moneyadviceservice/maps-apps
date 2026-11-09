import { render, screen } from '@testing-library/react';

import { PensionTypeLanding } from './PensionTypeLanding';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(() => ({ z: jest.fn(), locale: 'cy' })),
}));

jest.mock('data/pension-type', () => ({
  landingText: jest.fn(() => ({
    intro: 'Intro text',
    content1: 'Content 1',
    content2: 'Content 2',
    listItem1: 'List item 1',
    listItem2: 'List item 2',
    disclaimer: 'Disclaimer text',
    buttonText: 'Start',
    furtherHelp: 'Further help',
    guidesLinkText: 'Guides link',
    guidesLink: 'https://example.com/guides',
  })),
}));

jest.mock('@maps-react/pension-tools/components/Landing', () => ({
  Landing: jest.fn(
    ({ intro, content, contentAfterButton, actionLink, actionText }) => (
      <div>
        <p>{intro}</p>
        {content}
        <a href={actionLink}>{actionText}</a>
        {contentAfterButton}
      </div>
    ),
  ),
}));

describe('PensionTypeLanding', () => {
  it('renders the landing content', () => {
    render(<PensionTypeLanding lang="en" />);

    expect(screen.getByText('Intro text')).toBeInTheDocument();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByText('List item 1')).toBeInTheDocument();
    expect(screen.getByText('List item 2')).toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.getByText('Disclaimer text')).toBeInTheDocument();
    expect(screen.getByText(/Further help/)).toBeInTheDocument();
  });

  it('renders the guides link', () => {
    render(<PensionTypeLanding lang="en" />);

    expect(screen.getByRole('link', { name: 'Guides link' })).toHaveAttribute(
      'href',
      'https://example.com/guides',
    );
  });

  it('links to question 1 using the lang prop', () => {
    render(<PensionTypeLanding lang="en" />);

    expect(screen.getByRole('link', { name: 'Start' })).toHaveAttribute(
      'href',
      '/en/pension-type/question-1',
    );
  });

  it('falls back to the locale when lang is not provided', () => {
    render(<PensionTypeLanding />);

    expect(screen.getByRole('link', { name: 'Start' })).toHaveAttribute(
      'href',
      '/cy/pension-type/question-1',
    );
  });

  it('adds the embed query when embedded', () => {
    render(<PensionTypeLanding lang="en" isEmbed />);

    expect(screen.getByRole('link', { name: 'Start' })).toHaveAttribute(
      'href',
      '/en/pension-type/question-1?isEmbedded=true',
    );
  });
});
