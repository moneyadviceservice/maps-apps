import { render, screen } from '@testing-library/react';

import { ContentSection } from './ContentSection';

import '@testing-library/jest-dom';

jest.mock('components/BackToTop', () => ({
  BackToTop: () => <div data-testid="back-to-top">BackToTop</div>,
}));

describe('ContentSection', () => {
  const headingText = 'Sample Heading';
  const content = <p>Sample content paragraph</p>;

  it('renders the heading correctly', () => {
    render(<ContentSection heading={headingText} content={content} />);
    const heading = screen.getByRole('heading', { name: headingText });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H2');
  });

  it('renders the content', () => {
    render(<ContentSection heading={headingText} content={content} />);
    expect(screen.getByText('Sample content paragraph')).toBeInTheDocument();
  });

  it('renders the BackToTop component', () => {
    render(<ContentSection heading={headingText} content={content} />);
    expect(screen.getByTestId('back-to-top')).toBeInTheDocument();
  });

  it('sets the correct id on the root div', () => {
    render(<ContentSection heading={headingText} content={content} />);
    const rootDiv = screen.getByText(headingText).closest('div');
    expect(rootDiv).toHaveAttribute('id', 'sample-heading');
  });
});
