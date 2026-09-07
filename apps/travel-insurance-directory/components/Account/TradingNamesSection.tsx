import { Fragment, useState } from 'react';

import {
  AccountDirectoryStatusRow,
  AccountRegisteredNameRow,
  AccountSectionLinkRow,
} from 'components/Account/AccountFirmTableRows';
import {
  accountFirmRowLabels,
  accountTableLinkClassName,
  accountTradingNamesCopy,
  AVAILABLE_TRADING_NAMES_SECTION_ID,
} from 'data/pages/account/tradingNames';
import { filterTradingNamesBySearch } from 'lib/account/filterTradingNamesBySearch';
import {
  coverAndServiceAccountHref,
  customerContactAccountHref,
  getFirmSectionStatuses,
} from 'lib/account/firmSectionStatus';
import { getDirectoryStatusLabel } from 'lib/account/getDirectoryStatusLabel';
import { sortAccountTradingFirms } from 'lib/account/sortAccountTradingFirms';
import { hasFcaVisibilityBlock } from 'lib/firms/fcaVisibility';
import type {
  MainTravelInsuranceFirmDocument,
  TradingTravelInsuranceFirmDocument,
} from 'types/travel-insurance-firm';

import { Button } from '@maps-react/common/components/Button';
import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { TextInput } from '@maps-react/form/components/TextInput';

export type TradingNamesSectionProps = Readonly<{
  firm: MainTravelInsuranceFirmDocument;
  tradingFirms: TradingTravelInsuranceFirmDocument[];
  availableTradingNames: string[];
  initialAvailableTradingNameSearch?: string;
}>;

function isNameLinkedToMain(
  name: string,
  tradingFirms: TradingTravelInsuranceFirmDocument[],
): boolean {
  const key = name.trim().toLowerCase();
  return tradingFirms.some(
    (doc) => (doc.registered_name ?? '').trim().toLowerCase() === key,
  );
}

function TradingFirmSeparatorRow() {
  return (
    <tr className="border-t-2 border-gray-300">
      <td colSpan={3} className="py-6" />
    </tr>
  );
}

function TradingFirmRegisteredRows({
  tradingFirm,
}: Readonly<{
  tradingFirm: TradingTravelInsuranceFirmDocument;
}>) {
  const lbl = accountFirmRowLabels;
  const copy = accountTradingNamesCopy;
  const registeredName = tradingFirm.registered_name
    ? String(tradingFirm.registered_name)
    : '';

  if (!registeredName) {
    return null;
  }

  const directoryStatusLabel = getDirectoryStatusLabel(tradingFirm);
  const sectionStatuses = getFirmSectionStatuses(tradingFirm);
  const canRemove = !hasFcaVisibilityBlock(tradingFirm);

  return (
    <>
      <AccountRegisteredNameRow
        registeredNameLabel={lbl.registeredName}
        registeredName={registeredName}
        registeredNameAlign="left"
        action={
          canRemove ? (
            <form method="POST" action="/api/account/clear-trading-name">
              <input
                type="hidden"
                name="tradingFirmId"
                value={tradingFirm.id}
              />
              <button
                type="submit"
                className={`${accountTableLinkClassName} underline`}
                data-testid="remove-trading-name-button"
              >
                {copy.remove}
              </button>
            </form>
          ) : undefined
        }
      />
      <AccountDirectoryStatusRow
        statusLabel={lbl.status}
        directoryStatusLabel={directoryStatusLabel}
        colSpan={2}
      />
      <AccountSectionLinkRow
        sectionLabel={lbl.coverAndService}
        href={coverAndServiceAccountHref(tradingFirm.id, tradingFirm)}
        sectionStatus={sectionStatuses.coverAndService}
        colSpan={3}
      />
      <AccountSectionLinkRow
        sectionLabel={lbl.customerContactDetails}
        href={customerContactAccountHref(tradingFirm.id, tradingFirm)}
        sectionStatus={sectionStatuses.customerContactDetails}
        colSpan={3}
      />
    </>
  );
}

export const TradingNamesSection = ({
  firm,
  tradingFirms,
  availableTradingNames,
  initialAvailableTradingNameSearch,
}: TradingNamesSectionProps) => {
  const [searchQuery, setSearchQuery] = useState(
    initialAvailableTradingNameSearch ?? '',
  );

  const firmFrn = String(firm.fca_number ?? '');
  const linkedTradingFirms = sortAccountTradingFirms(
    tradingFirms.filter((doc) => Boolean(doc.registered_name?.trim())),
  );
  const namesToRender = availableTradingNames.filter(
    (name) => !isNameLinkedToMain(name, tradingFirms),
  );
  const hasNamesToAdd = namesToRender.length > 0;
  const showAvailableTradingNamesSection = hasNamesToAdd;
  const showAvailableNamesSearch = namesToRender.length > 1;
  const filteredNamesToRender = filterTradingNamesBySearch(
    namesToRender,
    searchQuery,
  );

  const lbl = accountFirmRowLabels;
  const copy = accountTradingNamesCopy;
  const tradingHeading =
    linkedTradingFirms.length === 1
      ? copy.tradingNameHeading
      : copy.tradingNamesHeading;

  return (
    <section className="max-w-3xl space-y-6 pt-8">
      <div className="space-y-2">
        <Heading level="h2" className="text-2xl font-bold text-gray-800">
          {tradingHeading}
        </Heading>

        {linkedTradingFirms.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-base lg:min-w-[36rem]">
              <tbody>
                {linkedTradingFirms.map((tradingFirm, index) => (
                  <Fragment key={tradingFirm.id}>
                    {index > 0 ? <TradingFirmSeparatorRow /> : null}
                    <TradingFirmRegisteredRows tradingFirm={tradingFirm} />
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Paragraph className="m-0 text-gray-800">{copy.emptyState}</Paragraph>
        )}
      </div>

      {showAvailableTradingNamesSection ? (
        <div
          id={AVAILABLE_TRADING_NAMES_SECTION_ID}
          className="space-y-3 scroll-mt-8"
        >
          <Heading level="h2">{copy.availableTradingNamesHeading}</Heading>

          {showAvailableNamesSearch ? (
            <form
              method="get"
              action={`/account#${AVAILABLE_TRADING_NAMES_SECTION_ID}`}
              className="max-w-md"
              data-testid="available-trading-names-search-form"
            >
              <TextInput
                id="available-trading-names-search"
                name="availableTradingNameSearch"
                label={copy.availableTradingNamesSearchLabel}
                placeholder={copy.availableTradingNamesSearchPlaceholder}
                defaultValue={initialAvailableTradingNameSearch ?? ''}
                onInput={(e) => setSearchQuery(e.currentTarget.value)}
                data-testid="available-trading-names-search"
              />
              <noscript>
                <Button type="submit" className="mt-2">
                  {copy.applyTradingNamesFilter}
                </Button>
              </noscript>
            </form>
          ) : null}

          {hasNamesToAdd ? (
            <>
              {filteredNamesToRender.length === 0 ? (
                <Paragraph
                  className="m-0 text-gray-800"
                  data-testid="no-results"
                >
                  {copy.availableTradingNamesNoSearchResults}
                </Paragraph>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-base lg:min-w-[36rem]">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-3 pr-8 text-left font-semibold text-gray-800">
                          {lbl.registeredName}
                        </th>
                        <th className="py-3 text-right font-semibold text-gray-800">
                          <span className="sr-only">{copy.actionSrOnly}</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredNamesToRender.map((name, index) => (
                        <tr
                          key={`${firmFrn}-${index}-${name}`}
                          className="border-b border-gray-200"
                          data-testid="available-trading-name-row"
                        >
                          <td
                            className="py-3 pr-8 text-gray-800"
                            data-testid="available-trading-name-label"
                          >
                            {name}
                          </td>
                          <td className="py-3 text-right text-gray-800">
                            <form
                              method="POST"
                              action="/api/account/set-trading-name"
                            >
                              <input type="hidden" name="name" value={name} />
                              <button
                                type="submit"
                                className={`${accountTableLinkClassName} underline font-semibold`}
                                data-testid="add-to-directory-button"
                              >
                                {copy.addToDirectory}
                              </button>
                            </form>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : null}
        </div>
      ) : null}
    </section>
  );
};
