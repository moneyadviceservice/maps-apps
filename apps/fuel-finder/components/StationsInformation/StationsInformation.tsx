import { format } from 'date-fns';

import { H1 } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import useLanguage from '@maps-react/hooks/useLanguage';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export interface StationsInformationProps {
  totalItems: number;
  fetchedAt: string;
  fuelTypeLabel?: string;
}

const StationsInformation = ({
  totalItems,
  fetchedAt,
  fuelTypeLabel,
}: StationsInformationProps) => {
  const { z } = useTranslation();
  const lang = useLanguage();

  return (
    <div className="t-stations-information text-base text-gray-800 space-y-2.5">
      <H1 color="text-blue-700" className="text-4xl md:text-6xl font-bold">
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
      {fetchedAt && (
        <div>
          {z({
            en: 'Prices last updated',
            cy: 'Prisiau wedi\u2019u diweddaru ddiwethaf',
          })}{' '}
          {format(new Date(fetchedAt), 'd/M/y HH:mm')}
        </div>
      )}
    </div>
  );
};

export default StationsInformation;
