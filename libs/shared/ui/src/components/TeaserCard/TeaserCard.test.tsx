import React from 'react';

import { useRouter } from 'next/router';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TeaserCard, TeaserCardProps } from './TeaserCard';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

type StaticImageData = {
  src: string;
  height: number;
  width: number;
  blurDataURL?: string;
};

const image1: StaticImageData = {
  src: '/bubbles.jpg',
  height: 100,
  width: 100,
};

describe('TeaserCard', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { language: 'en' },
      asPath: '/en',
    });
  });

  const defaultProps: TeaserCardProps = {
    title: 'Test Title',
    description: 'Test Description',
    href: '/test',
    image: image1,
    headingLevel: 'h5',
    imageClassName: 'test-image-class',
    className: 'test-class',
  };

  it('renders TeaserCard component correctly', () => {
    render(<TeaserCard {...defaultProps} />);

    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
  });

  it('moves focus to the title link when tabbing', async () => {
    const user = userEvent.setup();
    render(<TeaserCard {...defaultProps} />);

    const link = screen.getByRole('link', { name: defaultProps.title });
    const card = screen.getByTestId('teaserCard');

    await user.tab();

    expect(link).toHaveFocus();
    expect(card).not.toHaveFocus();
  });

  it('keeps the description outside the link', () => {
    render(<TeaserCard {...defaultProps} />);

    const link = screen.getByRole('link', { name: defaultProps.title });
    const description = screen.getByText(defaultProps.description);

    expect(link).not.toContainElement(description);
  });

  it('exposes only the title as the link accessible name', () => {
    render(<TeaserCard {...defaultProps} />);

    expect(
      screen.getByRole('link', { name: defaultProps.title }),
    ).toBeInTheDocument();
  });

  it('announces when a card opens in a new window', () => {
    render(<TeaserCard {...defaultProps} hrefTarget="_blank" />);

    expect(
      screen.getByRole('link', { name: 'Test Title (opens in a new window)' }),
    ).toBeInTheDocument();
  });

  it('announces when a card opens in a new window in Welsh', () => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { language: 'cy' },
      asPath: '/cy',
    });

    render(<TeaserCard {...defaultProps} hrefTarget="_blank" />);

    expect(
      screen.getByRole('link', {
        name: 'Test Title (yn agor mewn ffenestr newydd)',
      }),
    ).toBeInTheDocument();
  });

  it('renders correct heading element when headingComponent prop is provided', () => {
    const { container } = render(
      <TeaserCard {...defaultProps} headingLevel="h4" headingComponent="h3" />,
    );

    // Should render an h3 element (semantic) with h4 styling (visual)
    const heading = container.querySelector('h3');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Test Title');
  });
});
