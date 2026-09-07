import React from 'react';

import { render, screen } from '@testing-library/react';

import {
  ExpandableContainer,
  ExpandableContainerProps,
} from './ExpandableContainer';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/common/components/Heading', () => ({
  Heading: jest.fn(({ children }) => <h2>{children}</h2>),
}));

jest.mock('@maps-react/common/components/ExpandableSection', () => ({
  ExpandableSection: jest.fn(({ title, children }) => (
    <div>
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  )),
}));

describe('ExpandableContainer', () => {
  const setup = (props: ExpandableContainerProps) => {
    render(<ExpandableContainer {...props} />);
  };

  it('renders all items with correct titles and texts', () => {
    const headingText = 'Test Heading';
    const items = [
      { title: 'Item 1', text: 'Item 1 Text' },
      { title: 'Item 2', text: 'Item 2 Text' },
    ];

    setup({ heading: headingText, items });

    items.forEach(({ title, text }) => {
      const sectionTitle = screen.getByText(title);
      expect(sectionTitle).toBeInTheDocument();

      const sectionText = screen.getByText(text);
      expect(sectionText).toBeInTheDocument();
    });
  });

  it('renders ReactNode correctly in items', () => {
    const headingText = 'Test Heading';
    const items = [
      { title: 'Item 1', text: <span>Item 1 ReactNode Text</span> },
    ];

    setup({ heading: headingText, items });

    const sectionText = screen.getByText('Item 1 ReactNode Text');
    expect(sectionText).toBeInTheDocument();
  });
});
