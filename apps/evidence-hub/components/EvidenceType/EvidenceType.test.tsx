import { render, screen } from '@testing-library/react';

import { EvidenceType } from './EvidenceType';

import '@testing-library/jest-dom';

describe('EvidenceType', () => {
  beforeEach(() => {
    render(<EvidenceType />);
  });

  it('renders the label "Evidence type:"', () => {
    expect(screen.getByTestId('evidence-type')).toBeInTheDocument();
  });

  it('renders "Insight" in a pink-colored span', () => {
    const insight = screen.getByTestId('evidence-type-data');
    expect(insight).toBeInTheDocument();
    expect(insight.tagName).toBe('SPAN');
    expect(insight).toHaveClass('text-magenta-500');
  });

  it('renders a list with one item "Qualitative"', () => {
    const listItem = screen.getByRole('listitem');
    expect(listItem).toHaveTextContent('Qualitative');
  });
});
