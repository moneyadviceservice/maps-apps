import React from 'react';

import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { SupportCallout } from './SupportCallout';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

const EXPLORE = 'support-callout-link-explore';
const UNDERSTAND = 'support-callout-link-understand';
const REPORT = 'support-callout-link-report';
const CONTACT = 'support-callout-link-contact';

describe('SupportCallout', () => {
  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key,
      locale: 'en',
    });
  });

  it('renders correctly without explore link', () => {
    const { container, queryByTestId } = render(
      <SupportCallout showExploreLink={false} />,
    );
    expect(queryByTestId(EXPLORE)).not.toBeInTheDocument();
    expect(queryByTestId(UNDERSTAND)).toBeInTheDocument();
    expect(queryByTestId(REPORT)).toBeInTheDocument();
    expect(queryByTestId(CONTACT)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('renders correctly without understand link', () => {
    const { container, queryByTestId } = render(
      <SupportCallout showUnderstandLink={false} />,
    );
    expect(queryByTestId(EXPLORE)).toBeInTheDocument();
    expect(queryByTestId(UNDERSTAND)).not.toBeInTheDocument();
    expect(queryByTestId(REPORT)).toBeInTheDocument();
    expect(queryByTestId(CONTACT)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('renders correctly without report link', () => {
    const { container, queryByTestId } = render(
      <SupportCallout showReportLink={false} />,
    );
    expect(queryByTestId(EXPLORE)).toBeInTheDocument();
    expect(queryByTestId(UNDERSTAND)).toBeInTheDocument();
    expect(queryByTestId(REPORT)).not.toBeInTheDocument();
    expect(queryByTestId(CONTACT)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('renders correctly without contact link', () => {
    const { container, queryByTestId } = render(
      <SupportCallout showContactLink={false} />,
    );
    expect(queryByTestId(EXPLORE)).toBeInTheDocument();
    expect(queryByTestId(UNDERSTAND)).toBeInTheDocument();
    expect(queryByTestId(REPORT)).toBeInTheDocument();
    expect(queryByTestId(CONTACT)).not.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('renders correctly with all links by default', () => {
    const { container, queryByTestId } = render(<SupportCallout />);
    expect(queryByTestId(EXPLORE)).toBeInTheDocument();
    expect(queryByTestId(UNDERSTAND)).toBeInTheDocument();
    expect(queryByTestId(REPORT)).toBeInTheDocument();
    expect(queryByTestId(CONTACT)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
