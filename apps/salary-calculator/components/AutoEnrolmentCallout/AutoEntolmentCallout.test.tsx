import { render, screen } from '@testing-library/react';
import { AutoEnrolmentCallout } from './AutoEnrolmentCallout';
import '@testing-library/jest-dom';

// Mock the useTranslation hook
jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: ({ en }: { en: string }) => en,
  }),
}));

describe('AutoEnrolmentCallout', () => {
  it('renders correctly', () => {
    render(<AutoEnrolmentCallout />);

    expect(
      screen.getByText('You could be missing out on money for your pension'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/You've told us that you earn at least £10,000 a year/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/It can be an effective way to build a pension pot/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Find out more about/)).toBeInTheDocument();
  });
});
