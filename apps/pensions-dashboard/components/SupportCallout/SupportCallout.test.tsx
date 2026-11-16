import React from 'react';

import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { SupportCallout } from './SupportCallout';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

const USING = 'support-callout-link-using';
const UNDERSTAND = 'support-callout-link-understand';
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
    expect(queryByTestId(USING)).not.toBeInTheDocument();
    expect(queryByTestId(UNDERSTAND)).toBeInTheDocument();
    expect(queryByTestId(CONTACT)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('renders correctly without understand link', () => {
    const { container, queryByTestId } = render(
      <SupportCallout showUnderstandLink={false} />,
    );
    expect(queryByTestId(USING)).toBeInTheDocument();
    expect(queryByTestId(UNDERSTAND)).not.toBeInTheDocument();
    expect(queryByTestId(CONTACT)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('renders correctly without contact link', () => {
    const { container, queryByTestId } = render(
      <SupportCallout showContactLink={false} />,
    );
    expect(queryByTestId(USING)).toBeInTheDocument();
    expect(queryByTestId(UNDERSTAND)).toBeInTheDocument();
    expect(queryByTestId(CONTACT)).not.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('renders correctly with all links by default', () => {
    const { container, queryByTestId } = render(<SupportCallout />);
    expect(queryByTestId(USING)).toBeInTheDocument();
    expect(queryByTestId(UNDERSTAND)).toBeInTheDocument();
    expect(queryByTestId(CONTACT)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
