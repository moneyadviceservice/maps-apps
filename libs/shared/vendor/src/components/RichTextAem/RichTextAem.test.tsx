import React from 'react';

import { render, screen } from '@testing-library/react';

import { RichTextAem, VariantType } from '.';
import { mapJsonRichText } from '../../utils/RenderRichText';
import mockData from './RichTextAem.mock.json';

describe('RichTextAem component', () => {
  it('renders correctly', () => {
    render(
      <RichTextAem testId="test-component">
        {mapJsonRichText(mockData.content.json)}
      </RichTextAem>,
    );
    const container = screen.getByTestId('test-component');
    expect(container).toMatchSnapshot();
  });

  it('renders a positive list variant correctly', () => {
    render(
      <RichTextAem
        listVariant={VariantType.POSITIVE}
        testId="positive-test-component"
      >
        {mapJsonRichText(mockData.content.json)}
      </RichTextAem>,
    );
    const container = screen.getByTestId('positive-test-component');
    expect(container).toMatchSnapshot();
  });

  it('renders a negative list variant correctly', () => {
    render(
      <RichTextAem
        listVariant={VariantType.NEGATIVE}
        testId="negative-test-component"
      >
        {mapJsonRichText(mockData.content.json)}
      </RichTextAem>,
    );
    const container = screen.getByTestId('negative-test-component');
    expect(container).toMatchSnapshot();
  });
});
