import { render } from '@testing-library/react';

import { TableSection } from './TableSection';

import '@testing-library/jest-dom';
describe('TableSection', () => {
  it('renders the heading', () => {
    const { getByTestId, container } = render(
      <TableSection heading="Test Heading" />,
    );
    expect(getByTestId('table-section-heading')).toBeInTheDocument();
    expect(container.querySelector('table')).toHaveClass('border-t-1');
  });

  it('renders children inside the table', () => {
    const { getByTestId } = render(
      <TableSection heading="Test Heading">
        <tbody>
          <tr>
            <td>Child Content</td>
          </tr>
        </tbody>
      </TableSection>,
    );
    expect(getByTestId('table-section-content')).toBeInTheDocument();
  });

  it('applies border-top class when borderTop is true', () => {
    const { container } = render(
      <TableSection heading="Test Heading" borderTop={true} />,
    );
    expect(container.querySelector('table')).toHaveClass('border-t-1');
  });

  it('does not apply border-top class when borderTop is false', () => {
    const { container } = render(
      <TableSection heading="Test Heading" borderTop={false} />,
    );
    expect(container.querySelector('table')).not.toHaveClass('border-t-1');
  });
});
