import React from 'react';

import { render } from '@testing-library/react';

import { EmbedPageLayout } from '.';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('EmbedPageLayout', () => {
  it('renders correctly', () => {
    const { container } = render(
      <EmbedPageLayout title={'test title'}>test content</EmbedPageLayout>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders correctly with no title', () => {
    const { container } = render(
      <EmbedPageLayout>test content</EmbedPageLayout>,
    );
    expect(container).toMatchSnapshot();
  });
});
