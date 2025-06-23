import { render, screen } from '@testing-library/react';

import { EmbedMSForm } from './EmbedMSForm';

import '@testing-library/jest-dom';

describe('EmbedMSForm', () => {
  const defaultProps = {
    src: 'https://example.com/form',
    title: 'Test Form',
  };

  it('renders default iframe', () => {
    const { container } = render(<EmbedMSForm {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('renders an iframe with a supplied data-testid', () => {
    render(<EmbedMSForm {...defaultProps} testId="test-id" />);
    const iframe = screen.getByTestId('test-id');
    expect(iframe).toBeInTheDocument();
  });

  it('renders an iframe with a different id', () => {
    const { container } = render(
      <EmbedMSForm {...defaultProps} id="test-id" />,
    );
    const iframe = container.querySelector('#test-id');
    expect(iframe).toBeInTheDocument();
  });

  it('applies additional classNames', () => {
    render(<EmbedMSForm {...defaultProps} classNames="extra-class" />);
    const iframe = screen.getByTestId('embedded-ms-form');
    expect(iframe).toHaveClass('w-full extra-class');
  });
});
