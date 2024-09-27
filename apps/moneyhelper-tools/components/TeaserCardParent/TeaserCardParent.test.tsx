import React from 'react';
import { render } from '@testing-library/react';
import { TeaserCardParent, TeaserCardParentProps } from './TeaserCardParent';
import { TeaserCard } from 'components/TeaserCard';
import { Heading } from '@maps-react/common/components/Heading';

type StaticImageData = {
  src: string;
  height: number;
  width: number;
  blurDataURL?: string;
};

const image1: StaticImageData = {
  src: '/teaser-card-images/bubbles.jpg',
  height: 100,
  width: 100,
};

jest.mock('components/TeaserCard', () => ({
  TeaserCard: jest.fn(() => <div>TeaserCard</div>),
}));

jest.mock('@maps-react/common/components/Heading', () => ({
  Heading: jest.fn(() => <div>Heading</div>),
}));

describe('TeaserCardParent', () => {
  const mockProps: TeaserCardParentProps = {
    heading: 'Test Heading',
    items: [
      {
        title: 'Item 1',
        description: 'Description 1',
        href: '/link1',
        image: image1,
      },
      {
        title: 'Item 2',
        description: 'Description 2',
        href: '/link2',
        image: image1,
      },
    ],
    target: '_blank',
    headingClasses: 'custom-heading-class',
    teaserHeadingLevel: 'h3',
  };

  it('renders the Heading component with correct props', () => {
    render(<TeaserCardParent {...mockProps} />);

    expect(Heading).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'h1',
        component: 'h2',
        className: 'my-6 custom-heading-class',
        children: 'Test Heading',
      }),
      {},
    );
  });

  it('renders the correct number of TeaserCard components with correct props', () => {
    render(<TeaserCardParent {...mockProps} />);

    expect(TeaserCard).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Item 1',
        description: 'Description 1',
        href: '/link1',
        image: image1,
        hrefTarget: '_blank',
        headingLevel: 'h3',
      }),
      {},
    );

    expect(TeaserCard).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Item 2',
        description: 'Description 2',
        href: '/link2',
        image: image1,
        hrefTarget: '_blank',
        headingLevel: 'h3',
      }),
      {},
    );
  });
});
