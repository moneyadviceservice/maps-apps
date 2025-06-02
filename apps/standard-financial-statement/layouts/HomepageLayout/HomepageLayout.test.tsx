import { render } from '@testing-library/react';

import { HomepageLayout } from './HomepageLayout';

import '@testing-library/jest-dom';

const page = {
  hero: {
    title: 'Hero title',
    description: {
      json: [{ nodeType: 'p' }],
    },
    image: {
      image: { _path: '/image-src', width: 125, height: 125, mimeType: 'png' },
      altText: 'alt text',
    },
    link: {
      linkTo: 'url/route',
      text: 'Link Text',
      description: 'Description of link',
    },
  },
  teaserCards: [
    {
      title: 'Teaser Title',
      description: 'Teaser description',
      href: 'teaser-link',
      image: {
        image: {
          _path: '/image-src',
          width: 125,
          height: 125,
          mimeType: 'png',
        },
        altText: 'alt text',
      },
    },
  ],
};

describe('HomepageLayout', () => {
  it('renders dom elements correctly', () => {
    const { container, getByTestId, getByText } = render(
      <HomepageLayout page={page} assetPath="/asset-path" />,
    );

    const heading = getByTestId('homepage-heading');
    expect(heading.textContent).toBe('Hero title');

    const link = getByTestId('homepage-primary-link');
    expect(link).toHaveAttribute('href', 'url/route');

    expect(getByText('Teaser Title')).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });
});
