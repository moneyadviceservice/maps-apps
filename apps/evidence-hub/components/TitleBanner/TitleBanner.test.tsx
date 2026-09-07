import { render, screen } from '@testing-library/react';

import { TitleBanner } from '.';

describe('TitleBanner component', () => {
  it('renders correctly', () => {
    render(<TitleBanner title="TitleBanner" />);
    const banner = screen.getByTestId('title-banner');
    expect(banner).toMatchSnapshot();
  });
});
