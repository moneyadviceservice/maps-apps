import { render, screen } from '@testing-library/react';

import { MedicalScreeningBanner } from './MedicalScreeningBanner';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: (t: { en: string; cy: string }) => t.en,
  }),
}));

describe('MedicalScreeningBanner', () => {
  it('renders warning callout with medical screening copy', () => {
    render(<MedicalScreeningBanner />);

    expect(
      screen.getByTestId('callout-warning-medical-screening-banner'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /If you are going to get quotes from different providers, try and use firms that use different medical screening companies/,
      ),
    ).toBeInTheDocument();
  });
});
