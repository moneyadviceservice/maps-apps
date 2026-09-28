import { render, screen } from '@testing-library/react';

import { PensionDetailHeading } from './PensionDetailHeading';

import '@testing-library/jest-dom/extend-expect';

describe('PensionDetailHeading', () => {
  it('renders title correctly', () => {
    render(<PensionDetailHeading title="Test Title" />);

    const heading = screen.getByTestId('heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Test Title');
  });
});
