import React from 'react';

import { Group } from 'types';

import { getDefaultNormalizer, render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';

import { PdfReport, PdfReportContent, PdfReportData } from './PdfReport';

jest.mock('@react-pdf/renderer', () => {
  const React = require('react');
  return {
    Document: ({ children }: { children: React.ReactNode }) =>
      React.createElement('div', null, children),
    Page: ({ children }: { children: React.ReactNode }) =>
      React.createElement('div', null, children),
    View: ({ children }: { children: React.ReactNode }) =>
      React.createElement('div', null, children),
    Text: ({ children }: { children: React.ReactNode }) =>
      React.createElement('span', null, children),
    Link: ({ src, children }: { src: string; children: React.ReactNode }) =>
      React.createElement('a', { href: src }, children),
    Image: ({ src }: { src: string }) =>
      React.createElement('img', { src, alt: '' }),
    StyleSheet: { create: <T,>(styles: T): T => styles },
  };
});

const content: PdfReportContent = {
  pdfTitle: 'Your personalised Money Midlife MOT report',
  description: 'Well done for completing the Money Midlife MOT.',
  focusOnTitle: 'What to focus on',
  focusOnDescription: 'These are the key areas.',
  buildOnTitle: 'What to build on',
  buidlOnDescription: 'You are on the right track.',
  keepGoingTitle: 'What to keep doing',
  keepGoingDescription: 'Well done! You are doing great.',
};

const groups: Group[] = [
  {
    title: '  Estate planning  ',
    group: 'estate-planning',
    descritionScoreOne: '  Estate score one.  ',
    descritionScoreTwo: 'Estate score two.',
    descritionScoreThree: 'Estate score three.',
  },
  {
    title: 'Budgeting',
    group: 'budgeting',
    descritionScoreOne: 'Budgeting score one.',
    descritionScoreTwo: 'Budgeting score two.',
    descritionScoreThree: 'Budgeting score three.',
  },
  {
    title: 'Preventing debts',
    group: 'preventing-debts',
    descritionScoreOne: 'Debts score one.',
    descritionScoreTwo: 'Debts score two.',
    descritionScoreThree: 'Debts score three.',
  },
];

const data: PdfReportData = {
  highRiskGroup: {
    'estate-planning': {
      links: [
        {
          title: 'Planning your will',
          link: 'https://example.com/will',
          type: 'article',
          description: 'is a step-by-step guide.',
        },
        {
          title: 'Link without description',
          link: 'https://example.com/no-description',
          type: 'tool',
        },
      ],
      score: 1,
    },
  },
  mediumRiskGroup: {
    budgeting: { links: [], score: 2 },
    'group-without-content': { links: [], score: 2 },
  },
  lowRiskGroup: {
    'preventing-debts': { links: [], score: 3 },
  },
};

const renderPdfReport = () =>
  render(
    <PdfReport
      data={data}
      content={content}
      groups={groups}
      language="en"
      logoSrc="/public/MH_logo.png"
    />,
  );

describe('PdfReport', () => {
  it('renders the report title and introduction', () => {
    renderPdfReport();

    expect(
      screen.getByText('Your personalised Money Midlife MOT report'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Well done for completing the Money Midlife MOT.'),
    ).toBeInTheDocument();
  });

  it('renders all three section titles with their descriptions', () => {
    renderPdfReport();

    expect(screen.getByText('What to focus on')).toBeInTheDocument();
    expect(screen.getByText('These are the key areas.')).toBeInTheDocument();
    expect(screen.getByText('What to build on')).toBeInTheDocument();
    expect(screen.getByText('You are on the right track.')).toBeInTheDocument();
    expect(screen.getByText('What to keep doing')).toBeInTheDocument();
    expect(
      screen.getByText('Well done! You are doing great.'),
    ).toBeInTheDocument();
  });

  it('renders group titles and descriptions trimmed', () => {
    renderPdfReport();

    const noTrimNormalizer = getDefaultNormalizer({ trim: false });
    expect(
      screen.getByText('Estate planning', { normalizer: noTrimNormalizer }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Estate score one.', { normalizer: noTrimNormalizer }),
    ).toBeInTheDocument();
  });

  it('renders the score-one description for every risk band (parity with the previous report)', () => {
    renderPdfReport();

    expect(screen.getByText('Budgeting score one.')).toBeInTheDocument();
    expect(screen.queryByText('Budgeting score two.')).not.toBeInTheDocument();
    expect(screen.getByText('Debts score one.')).toBeInTheDocument();
    expect(screen.queryByText('Debts score three.')).not.toBeInTheDocument();
  });

  it('renders each link with its href and inline description', () => {
    renderPdfReport();

    const link = screen.getByRole('link', { name: 'Planning your will' });
    expect(link).toHaveAttribute('href', 'https://example.com/will');
    expect(link.parentElement).toHaveTextContent(
      'Planning your will is a step-by-step guide.',
    );
  });

  it('renders a link without a description without printing "undefined"', () => {
    renderPdfReport();

    const link = screen.getByRole('link', {
      name: 'Link without description',
    });
    expect(link).toHaveAttribute('href', 'https://example.com/no-description');
    expect(link.parentElement).not.toHaveTextContent('undefined');
  });

  it('renders nothing for a data group with no matching groups entry', () => {
    renderPdfReport();

    expect(screen.queryByText(/group-without-content/)).not.toBeInTheDocument();
    // Only the three matched group titles are rendered.
    expect(screen.getByText('Budgeting')).toBeInTheDocument();
    expect(screen.getByText('Preventing debts')).toBeInTheDocument();
  });
});
