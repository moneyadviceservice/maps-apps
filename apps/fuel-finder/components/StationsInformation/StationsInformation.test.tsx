import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import { setupUseRouter } from '../../utils/FuelFinder/testHelpers';
import StationsInformation from './StationsInformation';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('date-fns', () => ({
  format: () => '11/4/2026 09:30',
}));

describe('StationsInformation', () => {
  setupUseRouter();

  it('renders heading, change location link and last updated timestamp', () => {
    const { container } = render(
      <StationsInformation
        totalItems={12}
        fetchedAt="2026-04-11T09:30:00.000Z"
        fuelTypeLabel="Unleaded (E10)"
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders singular heading when totalItems is 1', () => {
    const { container } = render(
      <StationsInformation
        totalItems={1}
        fetchedAt="2026-04-11T09:30:00.000Z"
        fuelTypeLabel="Diesel"
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('omits the last updated timestamp when fetchedAt is empty', () => {
    const { container } = render(
      <StationsInformation totalItems={0} fetchedAt="" />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the no-results location message when totalItems is 0', () => {
    const { getByTestId, getByText } = render(
      <StationsInformation
        totalItems={0}
        fetchedAt="2026-04-11T09:30:00.000Z"
      />,
    );
    expect(getByTestId('no-results-message')).toBeTruthy();
    expect(getByText(/no results that match your location/i)).toBeTruthy();
  });

  it('renders the no-results filter message when hasActiveFilters is true', () => {
    const { getByText, getByRole } = render(
      <StationsInformation
        totalItems={0}
        fetchedAt="2026-04-11T09:30:00.000Z"
        hasActiveFilters={true}
        clearFiltersHref="/search"
      />,
    );
    expect(
      getByText(/no results that match the filters you selected/i),
    ).toBeTruthy();
    expect(getByRole('link', { name: /reset all/i })).toHaveAttribute(
      'href',
      '/search',
    );
  });

  it('uses default clearFiltersHref when not provided', () => {
    const { getByRole } = render(
      <StationsInformation
        totalItems={0}
        fetchedAt="2026-04-11T09:30:00.000Z"
        hasActiveFilters={true}
      />,
    );
    expect(getByRole('link', { name: /reset all/i })).toHaveAttribute(
      'href',
      '/',
    );
  });

  it('does not render the no-results message when totalItems is greater than 0', () => {
    const { queryByTestId } = render(
      <StationsInformation
        totalItems={5}
        fetchedAt="2026-04-11T09:30:00.000Z"
        fuelTypeLabel="Unleaded"
      />,
    );
    expect(queryByTestId('no-results-message')).toBeNull();
  });

  it('renders the report-a-price-error copy with a GOV.UK link opening in a new tab', () => {
    const { getByRole } = render(
      <StationsInformation
        totalItems={5}
        fetchedAt="2026-04-11T09:30:00.000Z"
        fuelTypeLabel="Unleaded"
      />,
    );
    const link = getByRole('link', { name: /report the error/i });
    expect(link).toHaveAttribute(
      'href',
      'https://www.gov.uk/guidance/report-an-error-in-fuel-prices-or-forecourt-details',
    );
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('hides the report-a-price-error copy when the no-results message is shown', () => {
    const { getByTestId, queryByRole } = render(
      <StationsInformation
        totalItems={0}
        fetchedAt="2026-04-11T09:30:00.000Z"
      />,
    );
    expect(getByTestId('no-results-message')).toBeTruthy();
    expect(queryByRole('link', { name: /report the error/i })).toBeNull();
  });
});
