/** Row labels aligned with `FirmLayout` firm block table (account area). */
export const accountFirmRowLabels = {
  registeredName: 'Registered name',
  frn: 'FRN (FCA Firm Reference Number)',
  status: 'Status',
  coverAndService: 'Cover and service',
  customerContactDetails: 'Customer contact details',
};

/** Pink link styling for account firm table navigation rows. */
export const accountTableLinkClassName =
  'text-magenta-750 hover:text-magenta-700';

/** Hash target for no-JS search form reload on the account page. */
export const AVAILABLE_TRADING_NAMES_SECTION_ID = 'available-trading-names';

export const accountTradingNamesCopy = {
  tradingNameHeading: 'Trading name',
  tradingNamesHeading: 'Trading names',
  availableTradingNamesHeading: 'Available trading names',
  emptyState:
    'You have not added any trading names to the directory. You can add a trading name from the list of available trading names below.',
  noAvailable: 'No available trading names.',
  addToDirectory: 'Add to directory',
  remove: 'Remove',
  actionSrOnly: 'Action',
  availableTradingNamesSearchLabel: 'Search available trading names',
  availableTradingNamesSearchPlaceholder: 'Search by name',
  applyTradingNamesFilter: 'Apply filter',
  availableTradingNamesNoSearchResults: 'No trading names match your search.',
} as const;
