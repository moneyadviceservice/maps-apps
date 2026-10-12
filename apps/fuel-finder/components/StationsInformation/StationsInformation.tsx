import { format } from 'date-fns';

import { H1 } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import useLanguage from '@maps-react/hooks/useLanguage';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import NoResultsMessage from '../NoResultsMessage';

export interface StationsInformationProps {
  totalItems: number;
  fetchedAt: string;
  fuelTypeLabel?: string;
  hasActiveFilters?: boolean;
  clearFiltersHref?: string;
}

const StationsInformation = ({
  totalItems,
  fetchedAt,
  fuelTypeLabel,
  hasActiveFilters,
  clearFiltersHref = '/',
}: StationsInformationProps) => {
  const { z } = useTranslation();
  const lang = useLanguage();

  const reportErrorUrl =
    'https://www.gov.uk/guidance/report-an-error-in-fuel-prices-or-forecourt-details';

  return (
    <div
      className={`t-stations-information text-base text-gray-800 flex flex-col gap-4 ${
        totalItems === 0 ? 'pb-10 lg:pb-0 lg:gap-6' : 'pb-4 lg:pb-8 lg:gap-2'
      }`}
    >
      <div className="flex flex-col gap-4 lg:gap-2 lg:py-4">
        <H1 color="text-blue-700" className="text-4xl font-bold md:text-6xl">
          {z(
            totalItems === 1
              ? {
                  en: '{a} station found near your location for {b}',
                  cy: "{a} orsaf wedi'i chanfod ger eich lleoliad ar gyfer {b}",
                }
              : {
                  en: '{a} stations found near your location for {b}',
                  cy: "{a} gorsaf wedi'u canfod ger eich lleoliad ar gyfer {b}",
                },
            { a: (totalItems ?? 0).toString(), b: fuelTypeLabel ?? '' },
          )}
        </H1>
        <Link href={`/${lang}`}>
          {z({
            en: 'Change location',
            cy: 'Newid lleoliad',
          })}
        </Link>
      </div>
      {totalItems === 0 && (
        <NoResultsMessage
          hasActiveFilters={hasActiveFilters}
          clearFiltersHref={clearFiltersHref}
        />
      )}
      {fetchedAt && (
        <>
          <div>
            {z({
              en: 'Data last retrieved',
              cy: 'Adalwyd y data ddiwethaf',
            })}{' '}
            {format(new Date(fetchedAt), 'd/M/y HH:mm')}
          </div>
          {totalItems > 0 && (
            <div>
              {z({
                en: "If you spot a price at the pump that doesn't match these results, you can ",
                cy: "Os gwelwch chi bris wrth y pwmp nad yw'n cyfateb i'r canlyniadau hyn, gallwch chi ",
              })}
              <Link
                asInlineText
                href={reportErrorUrl}
                target="_blank"
                rel="noopener noreferrer"
                withIcon={false}
              >
                {z({ en: 'report the error', cy: 'roi gwybod am y gwall' })}
                <span className="sr-only">
                  {z({
                    en: ' (opens in a new tab)',
                    cy: ' (yn agor mewn tab newydd)',
                  })}
                </span>
              </Link>{' '}
              {z({ en: 'on GOV.UK', cy: 'ar GOV.UK' })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StationsInformation;
