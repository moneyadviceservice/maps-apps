import React from 'react';
import { render } from '@testing-library/react';
import { EmbedPageLayout } from '.';

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
});
