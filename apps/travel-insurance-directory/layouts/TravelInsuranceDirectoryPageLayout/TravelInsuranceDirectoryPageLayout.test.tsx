import { TravelInsuranceDirectoryPageLayout } from './TravelInsuranceDirectoryPageLayout';

import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
    asPath: '/en',
  }),
}));

describe('TravelInsuranceDirectoryPageLayout', () => {
  it('renders', () => {
    render(
      <TravelInsuranceDirectoryPageLayout pageTitle="Test page" title="TID">
        <p>Page content</p>
      </TravelInsuranceDirectoryPageLayout>,
    );

    expect(screen.getByText('Page content')).toBeInTheDocument();
    expect(screen.getAllByTestId('trustpilot-widget')).toHaveLength(1);
  });
});
