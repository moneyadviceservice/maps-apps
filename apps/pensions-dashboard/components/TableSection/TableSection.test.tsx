import { render } from '@testing-library/react';

import { TableSection } from './TableSection';

import '@testing-library/jest-dom';
describe('TableSection', () => {
  it('renders the heading', () => {
    const { getByTestId } = render(<TableSection heading="Test Heading" />);
    expect(getByTestId('table-section-heading')).toBeInTheDocument();
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
});
