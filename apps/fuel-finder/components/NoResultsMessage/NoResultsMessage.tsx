import { useMediaQuery } from 'react-responsive';

import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export interface NoResultsMessageProps {
  hasActiveFilters?: boolean;
  clearFiltersHref?: string;
}

const NoResultsMessage = ({
  hasActiveFilters,
  clearFiltersHref = '/',
}: NoResultsMessageProps) => {
  const { z } = useTranslation();

  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <output
      className="flex items-start gap-3 lg:gap-4"
      data-testid="no-results-message"
    >
      <div className="shrink-0 mt-0.5 lg:mt-0">
        <Icon
          type={IconType.WARNING_SQUARE}
          className="w-8 h-10 lg:w-10 lg:h-10"
        />
      </div>
      <p className="text-lg font-bold leading-relaxed text-gray-900 lg:pt-1">
        {hasActiveFilters ? (
          <>
            {z({
              en: 'There are no results that match the filters you selected. Try adjusting these to see more results or ',
              cy: "Nid oes unrhyw ganlyniadau sy'n cyfateb i'r hidlwyr a ddewisoch. Rhowch gynnig ar addasu'r rhain i weld mwy o ganlyniadau neu ",
            })}
            <Link href={clearFiltersHref}>
              {z({
                en: 'reset all.',
                cy: 'ailosod pob un.',
              })}
            </Link>
          </>
        ) : (
          z({
            en: isMobile
              ? 'There are no results that match your location. Use the filters below to adjust your search.'
              : 'There are no results that match your location. Use the filters on the left to adjust your search, eg by changing the distance to 10 miles.',

            cy: isMobile
              ? `Nid oes unrhyw ganlyniadau sy'n cyfateb i'ch lleoliad. Defnyddiwch y hidlwyr isod i addasu'ch chwiliad.`
              : `Nid oes unrhyw ganlyniadau sy'n cyfateb i'ch lleoliad. Defnyddiwch yr hidlwyr ar y chwith i addasu'ch chwiliad, ee trwy newid y pellter i 10 milltir.`,
          })
        )}
      </p>
    </output>
  );
};

export default NoResultsMessage;
