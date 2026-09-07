import { render, screen } from '@testing-library/react';

import { FirmLayout } from './FirmLayout';

import '@testing-library/jest-dom';

const minimalBlock = {
  registeredName: 'Example Ltd',
  frn: '111',
  directoryStatusLabel: 'Approved',
  coverAndService: {
    changeHref: '/cover',
    sectionStatus: 'completed' as const,
  },
  customerContactDetails: {
    changeHref: '/contact',
    sectionStatus: 'not_started' as const,
  },
};

const minimalIntro = [
  { id: 'p1', content: <span>First intro</span> },
  { id: 'p2', content: <span>Second intro</span> },
] as const;

describe('FirmLayout', () => {
  it('renders heading, intro, and main firm section', () => {
    render(
      <FirmLayout
        pageHeading="Account"
        introParagraphs={minimalIntro}
        mainAuthorisedFirmHeading="Main firm"
        mainAuthorisedFirm={minimalBlock}
      />,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Account' }),
    ).toBeInTheDocument();
    expect(screen.getByText('First intro')).toBeInTheDocument();
    expect(screen.getByText('Second intro')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Main firm' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Example Ltd')).toBeInTheDocument();
    expect(screen.getByText('111')).toBeInTheDocument();
    expect(screen.getByText('Approved')).toBeInTheDocument();
  });

  it('renders warning callout when callout prop is set', () => {
    render(
      <FirmLayout
        pageHeading="H"
        callout={<div data-testid="custom-callout">Alert</div>}
        introParagraphs={minimalIntro}
        mainAuthorisedFirmHeading="Main firm"
        mainAuthorisedFirm={minimalBlock}
      />,
    );

    expect(
      screen.getByTestId('callout-warning-firm-layout-callout'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('custom-callout')).toHaveTextContent('Alert');
  });

  it('does not render callout when callout is omitted', () => {
    render(
      <FirmLayout
        pageHeading="H"
        introParagraphs={minimalIntro}
        mainAuthorisedFirmHeading="Main firm"
        mainAuthorisedFirm={minimalBlock}
      />,
    );

    expect(
      screen.queryByTestId('callout-warning-firm-layout-callout'),
    ).not.toBeInTheDocument();
  });

  it('renders registered name as plain text when href is absent', () => {
    render(
      <FirmLayout
        pageHeading="H"
        introParagraphs={minimalIntro}
        mainAuthorisedFirmHeading="Main firm"
        mainAuthorisedFirm={{
          ...minimalBlock,
          registeredNameHref: undefined,
        }}
      />,
    );

    expect(
      screen.queryByRole('link', { name: 'Example Ltd' }),
    ).not.toBeInTheDocument();
  });

  it('renders registered name as link when href is present', () => {
    render(
      <FirmLayout
        pageHeading="H"
        introParagraphs={minimalIntro}
        mainAuthorisedFirmHeading="Main firm"
        mainAuthorisedFirm={{
          ...minimalBlock,
          registeredNameHref: '/firm',
        }}
      />,
    );

    expect(screen.getByRole('link', { name: 'Example Ltd' })).toHaveAttribute(
      'href',
      '/firm',
    );
  });

  it('shows progress rows with section links and status badges', () => {
    render(
      <FirmLayout
        pageHeading="H"
        introParagraphs={minimalIntro}
        mainAuthorisedFirmHeading="Main firm"
        mainAuthorisedFirm={minimalBlock}
      />,
    );

    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Cover and service' }),
    ).toHaveAttribute('href', '/cover');
    expect(
      screen.getByRole('link', { name: 'Customer contact details' }),
    ).toHaveAttribute('href', '/contact');
    expect(screen.getByText('completed')).toBeInTheDocument();
    expect(screen.getByText('not started')).toBeInTheDocument();
  });

  it('merges partial firmBlockRowLabels with defaults', () => {
    render(
      <FirmLayout
        pageHeading="H"
        introParagraphs={minimalIntro}
        mainAuthorisedFirmHeading="Main firm"
        mainAuthorisedFirm={minimalBlock}
        firmBlockRowLabels={{ registeredName: 'Legal name' }}
      />,
    );

    expect(screen.getByText('Legal name')).toBeInTheDocument();
    expect(
      screen.getByText('FRN (FCA Firm Reference Number)'),
    ).toBeInTheDocument();
  });
});
