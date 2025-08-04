import React from 'react';

import { render, screen } from '@testing-library/react';

import { DocLayout } from './DocLayout';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    z: (textMap: { en: string; cy: string }) => textMap.en,
  }),
}));

describe('DocLayout', () => {
  beforeEach(() => {
    render(<DocLayout />);
  });

  it('renders structural layout components', () => {
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('container')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
  });

  it('renders the main heading inside container', () => {
    const heading = screen.getByTestId('main-heading');
    expect(heading.tagName).toBe('H1');
    expect(heading).toHaveClass('my-6');
  });

  it('renders the evidence type section', () => {
    expect(screen.getByTestId('evidence-type')).toBeInTheDocument();
  });

  it('renders doc contents and key info side-by-side', () => {
    expect(screen.getByTestId('doc-contents')).toBeInTheDocument();
    expect(screen.getByTestId('key-info')).toBeInTheDocument();
  });

  it('renders all content sections (Context, The study, Points to consider, Key findings)', () => {
    const contentSections = screen.getAllByTestId('content-section');
    expect(contentSections).toHaveLength(4);
  });

  it('renders multiple paragraphs inside content sections', () => {
    const paragraphs = screen.getAllByTestId('paragraph');
    expect(paragraphs.length).toBeGreaterThan(5);
  });
});
