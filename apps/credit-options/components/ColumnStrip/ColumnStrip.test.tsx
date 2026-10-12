import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ColumnStrip } from './ColumnStrip';

const mockDetails = [
  { title: 'Label 1', value: 'Value 1' },
  { title: 'Label 2', value: 'Value 2' },
  { title: 'Label 3', value: 'Value 3' },
];

describe('ColumnStrip', () => {
  it('renders mobile table rows correctly (md:hidden)', () => {
    render(<ColumnStrip details={mockDetails} />);
    mockDetails.forEach(({ title, value }) => {
      expect(screen.getAllByText(title).length).toBeGreaterThan(0);
      expect(screen.getAllByText(value).length).toBeGreaterThan(0);
    });
  });

  it('renders desktop grid columns with correct test ids (md:block)', () => {
    render(<ColumnStrip details={mockDetails} />);
    mockDetails.forEach((_, i) => {
      const valueElement = screen.getByTestId(
        `unarranged-formatted-value-${i}`,
      );
      expect(valueElement).toBeInTheDocument();
      expect(valueElement).toHaveTextContent(mockDetails[i].value);
    });
  });

  it('uses the correct grid class for 3 items', () => {
    const { container } = render(<ColumnStrip details={mockDetails} />);
    const gridDiv = container.querySelector('.grid');
    expect(gridDiv?.className).toMatch(/grid-cols-3/);
  });

  it('falls back to grid-cols-1 when given more than 4 items', () => {
    const longDetails = new Array(5).fill(null).map((_, i) => ({
      title: `Label ${i + 1}`,
      value: `Value ${i + 1}`,
    }));
    const { container } = render(<ColumnStrip details={longDetails} />);
    const gridDiv = container.querySelector('.grid');
    expect(gridDiv?.className).toMatch(/grid-cols-1/);
  });
});
