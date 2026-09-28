import React from 'react';

import { render } from '@testing-library/react';

import RichTextWrapper from './RichTextWrapper';

describe('RichTextWrapper', () => {
  it('renders the component', () => {
    const { container } = render(
      <RichTextWrapper>Test Content</RichTextWrapper>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders the children with class', () => {
    const { container } = render(
      <RichTextWrapper className="className"> Test Content</RichTextWrapper>,
    );
    expect(container).toMatchSnapshot();
  });
});
