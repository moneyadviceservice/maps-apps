import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TeaserCard, TeaserCardProps } from './TeaserCard';

import '@testing-library/jest-dom';

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
    const { getByText } = render(<TeaserCard {...defaultProps} />);

    expect(getByText(defaultProps.title)).toBeInTheDocument();
    expect(getByText(defaultProps.description)).toBeInTheDocument();
  });

  it('applies hover, focus, and active styles', () => {
    const { getByTestId } = render(<TeaserCard {...defaultProps} />);
    const teaserCard = getByTestId('teaserCard');

    userEvent.hover(teaserCard);
    expect(teaserCard).toHaveClass('hover:outline-pink-800');

    userEvent.tab();
    expect(teaserCard).toHaveClass('focus:bg-yellow-400');
    expect(teaserCard).toHaveClass('focus:!text-gray-800');
    expect(teaserCard).toHaveClass('focus:shadow-none');

    userEvent.click(teaserCard);
    expect(teaserCard).toHaveClass('active:bg-gray-200');
    expect(teaserCard).toHaveClass('active:text-gray-800');
    expect(teaserCard).toHaveClass('active:shadow-none');
  });
});
