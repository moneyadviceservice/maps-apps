import React from 'react';

import { render, screen } from '@testing-library/react';

import { PhaseType } from '@maps-react/core/components/PhaseBanner';

import { ToolPageLayout } from '.';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

window.gtag = jest.fn();
window.CookieControl = {
  load: jest.fn(),
  open: jest.fn(),
};

describe('ToolPageLayout', () => {
  it('renders correctly', () => {
    const { container } = render(
      <ToolPageLayout title={'test title'}>Test content</ToolPageLayout>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with a phase banner when selected', () => {
    render(
      <ToolPageLayout phase={PhaseType.BETA} title={'test title'}>
        Test content
      </ToolPageLayout>,
    );
    const phaseBanner = screen.getByTestId('phase-banner');
    expect(phaseBanner).toBeVisible();
  });

  it('sets aria-hidden TRUE when cookie preferences is clicked', () => {
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [true, () => null]);

    const container = render(
      <ToolPageLayout title={'test title'}>Test content</ToolPageLayout>,
    );

    expect(container).toMatchSnapshot();
    expect(screen.getByTestId('main-content')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('renders the title as a span when selected', () => {
    render(
      <ToolPageLayout
        phase={PhaseType.BETA}
        titleTag="span"
        title={'test title'}
      >
        Test content
      </ToolPageLayout>,
    );
    const spanTitle = screen.getByTestId('toolpage-span-title');
    expect(spanTitle).toBeVisible();
  });

  it('renders the contact component if showContactUs prop is true', () => {
    const { container } = render(
      <ToolPageLayout title={'test title'} showContactUs={true}>
        Test content
      </ToolPageLayout>,
    );
    const contact = screen.getByTestId('contact');
    expect(contact).toBeVisible();
    expect(container).toMatchSnapshot();
  });

  it('renders the component with mainClassName class and noMargin', () => {
    const { getByTestId } = render(
      <ToolPageLayout
        title={'test title'}
        mainClassName="testClassName"
        noMargin={true}
      >
        Test content
      </ToolPageLayout>,
    );

    expect(getByTestId('main')).toHaveClass('testClassName');
    expect(getByTestId('main')).toHaveClass('my-2');
  });
});
