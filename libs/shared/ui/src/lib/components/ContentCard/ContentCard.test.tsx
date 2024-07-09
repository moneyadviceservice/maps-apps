import React from 'react';
import { render, screen } from '@testing-library/react';
import { ContentCard } from '.';

describe('ContentCard component', () => {
  it('renders correctly', () => {
    render(
      <ContentCard
        title={'test title'}
        image={{
          src: '/images/next-steps-control.png',
          alt: 'some alt text',
        }}
      >
        Test content
      </ContentCard>,
    );
    const contentCard = screen.getByTestId('content-card');
    expect(contentCard).toMatchSnapshot();
  });

  it('renders correctly with no image source', () => {
    render(<ContentCard title={'test title'}>Test content</ContentCard>);
    const contentCard = screen.getByTestId('content-card');
    expect(contentCard).toMatchSnapshot();
  });
});
