import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { TitleBanner } from './TitleBanner';

describe('TitleBanner', () => {
  it('renders the title text', () => {
    render(<TitleBanner title="Money and Pensions Service" />);

    expect(screen.getByTestId('title-banner-text')).toHaveTextContent(
      'Money and Pensions Service',
    );
  });

  it('renders the blue banner container', () => {
    render(<TitleBanner title="Money and Pensions Service" />);

    expect(screen.getByTestId('title-banner')).toHaveClass('bg-blue-700');
  });
});
