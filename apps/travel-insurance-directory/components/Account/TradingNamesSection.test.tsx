import {
  accountFirmRowLabels,
  accountTradingNamesCopy,
  AVAILABLE_TRADING_NAMES_SECTION_ID,
} from 'data/pages/account/tradingNames';
import { fireEvent, render, screen } from '@testing-library/react';

import {
  createMockFirm,
  createMockTradingFirm,
} from 'components/FirmSummary/mockFirm';
import { emptyServiceDetails } from 'lib/firms/firmDefaults';
import {
  HIDDEN_DUE_TO_FCA,
  HIDDEN_DUE_TO_TRADING_NAME,
} from 'lib/firms/fcaVisibility';
import {
  tripCoverWithAgeLimits,
  tripCoverWithSavedAgeLimits,
} from 'lib/firms/testing/tripCoverFixtures';
import type { TradingTravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

import { TradingNamesSection } from './TradingNamesSection';

import '@testing-library/jest-dom';

const mainFirm = createMockFirm({ id: 'main-firm-1' });

function makeTradingFirm(
  overrides: Partial<TradingTravelInsuranceFirmDocument> = {},
) {
  return createMockTradingFirm({
    main_firm_id: mainFirm.id,
    registered_name: 'Trading Brand',
    ...overrides,
  });
}

describe('TradingNamesSection', () => {
  // Fetch failure is modeled as availableTradingNames=[] (no error UI).
  it('shows empty state and hides available names table when none left to add', () => {
    render(
      <TradingNamesSection
        firm={mainFirm}
        tradingFirms={[]}
        availableTradingNames={[]}
      />,
    );

    expect(
      screen.getByText(accountTradingNamesCopy.emptyState),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(accountTradingNamesCopy.noAvailable),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', {
        level: 2,
        name: accountTradingNamesCopy.availableTradingNamesHeading,
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Trading names' }),
    ).toBeInTheDocument();
  });

  it('renders add-to-directory forms for each available name not yet linked', () => {
    const { container } = render(
      <TradingNamesSection
        firm={mainFirm}
        tradingFirms={[]}
        availableTradingNames={['Alpha Ltd', 'Beta Ltd']}
      />,
    );

    expect(screen.getByText('Alpha Ltd')).toBeInTheDocument();
    expect(screen.getByText('Beta Ltd')).toBeInTheDocument();

    expect(
      container.querySelectorAll(
        'form[action="/api/account/set-trading-name"]',
      ),
    ).toHaveLength(2);

    expect(
      screen.getAllByRole('button', {
        name: accountTradingNamesCopy.addToDirectory,
      }),
    ).toHaveLength(2);
  });

  it('hides available names table when every name is already linked', () => {
    render(
      <TradingNamesSection
        firm={mainFirm}
        tradingFirms={[makeTradingFirm({ registered_name: 'Alpha Ltd' })]}
        availableTradingNames={['Alpha Ltd']}
      />,
    );

    expect(
      screen.queryByRole('heading', {
        level: 2,
        name: accountTradingNamesCopy.availableTradingNamesHeading,
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', {
        name: accountTradingNamesCopy.addToDirectory,
      }),
    ).not.toBeInTheDocument();
  });

  it('hides add-to-directory for names already linked on this main firm', () => {
    const { container } = render(
      <TradingNamesSection
        firm={mainFirm}
        tradingFirms={[makeTradingFirm({ registered_name: 'Alpha Ltd' })]}
        availableTradingNames={['Alpha Ltd', 'Beta Ltd']}
      />,
    );

    expect(screen.getByText('Alpha Ltd')).toBeInTheDocument();

    const addForms = container.querySelectorAll(
      'form[action="/api/account/set-trading-name"]',
    );
    expect(addForms).toHaveLength(1);
    expect(addForms[0]?.querySelector('input[name="name"]')).toHaveAttribute(
      'value',
      'Beta Ltd',
    );
  });

  it('renders selected trading name table with remove action', () => {
    const { container } = render(
      <TradingNamesSection
        firm={mainFirm}
        tradingFirms={[makeTradingFirm({ id: 'trading-1' })]}
        availableTradingNames={[]}
      />,
    );

    expect(screen.getByText('Trading Brand')).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Trading Brand' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: accountTradingNamesCopy.remove }),
    ).toBeInTheDocument();

    const removeForm = container.querySelector(
      'form[action="/api/account/clear-trading-name"]',
    );
    expect(removeForm).toBeTruthy();
    expect(
      removeForm?.querySelector('input[name="tradingFirmId"]'),
    ).toHaveAttribute('value', 'trading-1');
  });

  describe('AC 1: Blocked State — Trading names section', () => {
    // AC 1: self-serve directory status for Invalid_FCA is No longer authorised (row stays in Trading names).
    it('keeps an Invalid_FCA trading name in the section as No longer authorised', () => {
      render(
        <TradingNamesSection
          firm={mainFirm}
          tradingFirms={[
            makeTradingFirm({
              id: 'trading-blocked',
              status: 'hidden',
              hidden_reason: HIDDEN_DUE_TO_FCA,
            }),
          ]}
          availableTradingNames={[]}
        />,
      );

      expect(screen.getByText('Trading Brand')).toBeInTheDocument();
      expect(screen.getByText('No longer authorised')).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: accountTradingNamesCopy.remove }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole('link', {
          name: accountFirmRowLabels.coverAndService,
        }),
      ).toBeInTheDocument();
    });
  });

  describe('AC 4: Data retention — Trading names section', () => {
    // AC 4: still show this trading name in the Trading name section as No longer valid (not deleted).
    it('keeps an AC 3 hidden trading name in the section as No longer valid', () => {
      render(
        <TradingNamesSection
          firm={mainFirm}
          tradingFirms={[
            makeTradingFirm({
              id: 'trading-blocked',
              status: 'hidden',
              hidden_reason: HIDDEN_DUE_TO_TRADING_NAME,
            }),
          ]}
          availableTradingNames={[]}
        />,
      );

      expect(screen.getByText('Trading Brand')).toBeInTheDocument();
      expect(screen.getByText('No longer valid')).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: accountTradingNamesCopy.remove }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole('link', {
          name: accountFirmRowLabels.coverAndService,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', {
          name: accountFirmRowLabels.customerContactDetails,
        }),
      ).toBeInTheDocument();
    });
  });

  it('renders valid trading names before FCA-blocked names', () => {
    render(
      <TradingNamesSection
        firm={mainFirm}
        tradingFirms={[
          makeTradingFirm({
            id: 'blocked',
            registered_name: 'Blocked Brand',
            created_at: '2025-06-01T00:00:00.000Z',
            hidden_reason: HIDDEN_DUE_TO_TRADING_NAME,
          }),
          makeTradingFirm({
            id: 'valid',
            registered_name: 'Valid Brand',
            created_at: '2025-01-01T00:00:00.000Z',
          }),
        ]}
        availableTradingNames={[]}
      />,
    );

    const names = screen.getAllByTestId('registered-name-value');
    expect(names.map((el) => el.textContent)).toEqual([
      'Valid Brand',
      'Blocked Brand',
    ]);
  });

  it('renders newest valid trading name first', () => {
    render(
      <TradingNamesSection
        firm={mainFirm}
        tradingFirms={[
          makeTradingFirm({
            id: 'older',
            registered_name: 'Older Brand',
            created_at: '2025-01-01T00:00:00.000Z',
          }),
          makeTradingFirm({
            id: 'newer',
            registered_name: 'Newer Brand',
            created_at: '2025-03-01T00:00:00.000Z',
          }),
        ]}
        availableTradingNames={[]}
      />,
    );

    const names = screen.getAllByTestId('registered-name-value');
    expect(names.map((el) => el.textContent)).toEqual([
      'Newer Brand',
      'Older Brand',
    ]);
  });

  it('uses singular trading name heading for one linked firm', () => {
    render(
      <TradingNamesSection
        firm={mainFirm}
        tradingFirms={[makeTradingFirm({ id: 'trading-1' })]}
        availableTradingNames={[]}
      />,
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'Trading name' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { level: 2, name: 'Trading names' }),
    ).not.toBeInTheDocument();
  });

  it('uses plural trading names heading for multiple linked firms', () => {
    render(
      <TradingNamesSection
        firm={mainFirm}
        tradingFirms={[
          makeTradingFirm({ id: 't1', registered_name: 'Brand One' }),
          makeTradingFirm({ id: 't2', registered_name: 'Brand Two' }),
        ]}
        availableTradingNames={[]}
      />,
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'Trading names' }),
    ).toBeInTheDocument();
  });

  it('renders multiple linked trading firms', () => {
    render(
      <TradingNamesSection
        firm={mainFirm}
        tradingFirms={[
          makeTradingFirm({ id: 't1', registered_name: 'Brand One' }),
          makeTradingFirm({ id: 't2', registered_name: 'Brand Two' }),
        ]}
        availableTradingNames={[]}
      />,
    );

    expect(screen.getByText('Brand One')).toBeInTheDocument();
    expect(screen.getByText('Brand Two')).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: accountTradingNamesCopy.remove }),
    ).toHaveLength(2);
  });

  it('renders margin spacer between multiple linked trading firms', () => {
    const { container } = render(
      <TradingNamesSection
        firm={mainFirm}
        tradingFirms={[
          makeTradingFirm({ id: 't1', registered_name: 'Brand One' }),
          makeTradingFirm({ id: 't2', registered_name: 'Brand Two' }),
        ]}
        availableTradingNames={[]}
      />,
    );

    const separator = container.querySelector('tr.border-t-2.border-gray-300');
    expect(separator).toBeInTheDocument();
    expect(separator?.querySelector('td')).toHaveClass('py-6');
    expect(container.querySelectorAll('tr[aria-hidden="true"]')).toHaveLength(
      0,
    );
  });

  it('does not render a spacer for a single linked trading firm', () => {
    const { container } = render(
      <TradingNamesSection
        firm={mainFirm}
        tradingFirms={[
          makeTradingFirm({ id: 't1', registered_name: 'Brand One' }),
        ]}
        availableTradingNames={[]}
      />,
    );

    expect(
      container.querySelectorAll('tr.border-t-2.border-gray-300'),
    ).toHaveLength(0);
  });

  it('uses stable keys for duplicate trading name strings', () => {
    const { container } = render(
      <TradingNamesSection
        firm={mainFirm}
        tradingFirms={[]}
        availableTradingNames={['Same', 'Same']}
      />,
    );

    const tables = container.querySelectorAll('table');
    const availableNamesTable = tables[tables.length - 1];
    expect(availableNamesTable.querySelectorAll('tbody tr')).toHaveLength(2);
  });

  it('treats empty trading registered_name as no selection', () => {
    render(
      <TradingNamesSection
        firm={mainFirm}
        tradingFirms={[makeTradingFirm({ registered_name: '' })]}
        availableTradingNames={[]}
      />,
    );

    expect(
      screen.getByText(accountTradingNamesCopy.emptyState),
    ).toBeInTheDocument();
  });

  it('shows different section badges per trading firm document', () => {
    render(
      <TradingNamesSection
        firm={mainFirm}
        tradingFirms={[
          makeTradingFirm({
            id: 't-complete-cover',
            registered_name: 'Complete Cover Ltd',
            trip_covers: [tripCoverWithSavedAgeLimits()],
            cover_service_confirmed_at: '2026-07-21T12:00:00.000Z',
            office: null,
            website_address: null,
          }),
          makeTradingFirm({
            id: 't-empty',
            registered_name: 'Empty Trading Ltd',
            service_details: emptyServiceDetails(),
            trip_covers: [],
            office: null,
            website_address: null,
          }),
        ]}
        availableTradingNames={[]}
      />,
    );

    expect(screen.getAllByText('completed')).toHaveLength(1);
    expect(screen.getAllByText('not started')).toHaveLength(3);
  });

  it('does not derive trading section status from the main firm', () => {
    const mainWithCompleteCover = createMockFirm({
      trip_covers: [
        tripCoverWithAgeLimits({
          up_to_30_days: { land: 70, cruise: null },
        }),
      ],
    });

    render(
      <TradingNamesSection
        firm={mainWithCompleteCover}
        tradingFirms={[
          makeTradingFirm({
            registered_name: 'Trading Empty',
            service_details: emptyServiceDetails(),
            trip_covers: [],
            office: null,
            website_address: null,
          }),
        ]}
        availableTradingNames={[]}
      />,
    );

    expect(screen.getAllByText('not started')).toHaveLength(2);
    expect(screen.queryByText('completed')).not.toBeInTheDocument();
  });

  it('links cover and service to the trading firm regions page', () => {
    render(
      <TradingNamesSection
        firm={mainFirm}
        tradingFirms={[makeTradingFirm({ id: 'trading-regions-1' })]}
        availableTradingNames={[]}
      />,
    );

    const coverLinks = screen.getAllByRole('link', {
      name: accountFirmRowLabels.coverAndService,
    });
    expect(coverLinks[0]).toHaveAttribute(
      'href',
      '/account/trip-cover/regions/trading-regions-1',
    );
  });

  it('links customer contact details to the firm contact start page when not confirmed', () => {
    render(
      <TradingNamesSection
        firm={mainFirm}
        tradingFirms={[makeTradingFirm({ id: 'trading-contact-1' })]}
        availableTradingNames={[]}
      />,
    );

    const contactLinks = screen.getAllByRole('link', {
      name: accountFirmRowLabels.customerContactDetails,
    });
    expect(contactLinks[0]).toHaveAttribute(
      'href',
      '/account/firm-details/customer-contact-details/trading-contact-1',
    );
  });

  it('renders section badges from each trading firm document data', () => {
    render(
      <TradingNamesSection
        firm={mainFirm}
        tradingFirms={[
          makeTradingFirm({
            id: 'trading-1',
            customer_contact_confirmed_at: '2026-07-21T12:00:00.000Z',
          }),
        ]}
        availableTradingNames={[]}
      />,
    );

    expect(screen.getByText('not started')).toBeInTheDocument();
    expect(screen.getByText('completed')).toBeInTheDocument();
  });

  it('does not render FRN row in linked trading names table', () => {
    render(
      <TradingNamesSection
        firm={mainFirm}
        tradingFirms={[makeTradingFirm({ id: 'trading-1' })]}
        availableTradingNames={[]}
      />,
    );

    expect(
      screen.queryByText(accountFirmRowLabels.frn),
    ).not.toBeInTheDocument();
  });

  it('does not show search when only one available name', () => {
    render(
      <TradingNamesSection
        firm={mainFirm}
        tradingFirms={[]}
        availableTradingNames={['Only One Ltd']}
      />,
    );

    expect(
      screen.queryByTestId('available-trading-names-search'),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Only One Ltd')).toBeInTheDocument();
  });

  it('shows search when two or more available names', () => {
    const { container } = render(
      <TradingNamesSection
        firm={mainFirm}
        tradingFirms={[]}
        availableTradingNames={['Alpha Ltd', 'Beta Ltd']}
      />,
    );

    expect(
      screen.getByTestId('available-trading-names-search'),
    ).toBeInTheDocument();
    expect(
      container.querySelector(`#${AVAILABLE_TRADING_NAMES_SECTION_ID}`),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('available-trading-names-search-form'),
    ).toHaveAttribute(
      'action',
      `/account#${AVAILABLE_TRADING_NAMES_SECTION_ID}`,
    );
    expect(container.querySelector('noscript')).toBeInTheDocument();
  });

  it('filters available names on input', () => {
    render(
      <TradingNamesSection
        firm={mainFirm}
        tradingFirms={[]}
        availableTradingNames={['Alpha Ltd', 'Beta Ltd', 'Gamma Co']}
      />,
    );

    fireEvent.input(screen.getByTestId('available-trading-names-search'), {
      target: { value: 'beta' },
    });

    expect(screen.queryByText('Alpha Ltd')).not.toBeInTheDocument();
    expect(screen.getByText('Beta Ltd')).toBeInTheDocument();
    expect(screen.queryByText('Gamma Co')).not.toBeInTheDocument();
  });

  it('filters from initialAvailableTradingNameSearch on first render', () => {
    render(
      <TradingNamesSection
        firm={mainFirm}
        tradingFirms={[]}
        availableTradingNames={['Alpha Ltd', 'Beta Ltd']}
        initialAvailableTradingNameSearch="beta"
      />,
    );

    expect(screen.queryByText('Alpha Ltd')).not.toBeInTheDocument();
    expect(screen.getByText('Beta Ltd')).toBeInTheDocument();
  });

  it('shows all names again when search is cleared', () => {
    render(
      <TradingNamesSection
        firm={mainFirm}
        tradingFirms={[]}
        availableTradingNames={['Alpha Ltd', 'Beta Ltd']}
      />,
    );

    const search = screen.getByTestId('available-trading-names-search');
    fireEvent.input(search, { target: { value: 'beta' } });
    fireEvent.input(search, { target: { value: '' } });

    expect(screen.getByText('Alpha Ltd')).toBeInTheDocument();
    expect(screen.getByText('Beta Ltd')).toBeInTheDocument();
  });

  it('shows no-results message when filter matches nothing', () => {
    render(
      <TradingNamesSection
        firm={mainFirm}
        tradingFirms={[]}
        availableTradingNames={['Alpha Ltd', 'Beta Ltd']}
      />,
    );

    fireEvent.input(screen.getByTestId('available-trading-names-search'), {
      target: { value: 'zzz' },
    });

    expect(
      screen.getByText(
        accountTradingNamesCopy.availableTradingNamesNoSearchResults,
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText('Alpha Ltd')).not.toBeInTheDocument();
  });
});
