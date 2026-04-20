import { useRouter } from 'next/router';

import { BackToTop } from '@maps-react/common/components/BackToTop';
import Pagination from '@maps-react/common/components/Pagination';
import { SocialShareTool } from '@maps-react/common/components/SocialShareTool';
import { ToolFeedback } from '@maps-react/common/components/ToolFeedback';
import { GridContainer } from '@maps-react/core/components/GridContainer';
import useLanguage from '@maps-react/hooks/useLanguage';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { fuelTypeOptions } from '../../data/fuel-finder';
import pageFilters from '../../utils/FuelFinder/filters/pageFilters';
import type { StationSearchResult } from '../../utils/FuelFinder/types';
import ActiveFilters from '../ActiveFilters';
import RefineSearch from '../RefineSearch';
import SortBar from '../SortBar';
import StationList from '../StationList';
import StationsInformation from '../StationsInformation';

export interface FuelFinderProps {
  stations: StationSearchResult[];
  totalItems: number;
  fetchedAt: string;
  hasSearched: boolean;
}

const FuelFinder = ({
  stations,
  totalItems,
  fetchedAt,
  hasSearched,
}: FuelFinderProps) => {
  const router = useRouter();
  const filters = pageFilters(router);
  const { z } = useTranslation();
  const lang = useLanguage();

  const canonicalUrl = `https://www.moneyhelper.org.uk/${lang}/everyday-money/fuel-finder`;

  const totalPages = Math.max(1, Math.ceil(totalItems / filters.perPage));
  const startIndex = (filters.page - 1) * filters.perPage;
  const endIndex = Math.min(startIndex + stations.length, totalItems);

  const fuelTypeLabel = fuelTypeOptions(z).find(
    (o) => o.value === filters.fuelType,
  )?.title;

  const stationsInformation = (
    <StationsInformation
      totalItems={totalItems}
      fetchedAt={fetchedAt}
      fuelTypeLabel={fuelTypeLabel}
    />
  );

  return (
    <GridContainer>
      <form method="get" className="col-span-12 w-full">
        <div className="flex flex-col">
          {hasSearched && (
            <div className="lg:hidden pb-2">{stationsInformation}</div>
          )}
          <div className="flex-row w-full lg:flex lg:space-x-6">
            <div className="mb-9 lg:w-[300px] lg:min-w-[300px]">
              <RefineSearch />
            </div>
            <div className="flex flex-col gap-y-4 flex-1 min-w-0">
              {hasSearched && (
                <>
                  <div className="hidden lg:block">{stationsInformation}</div>
                  {filters.count > 0 && <ActiveFilters />}
                  <div className="space-y-4">
                    <SortBar />
                    <StationList
                      stations={stations}
                      totalItems={totalItems}
                      hasSearched={hasSearched}
                      selectedFuelTypes={
                        filters.fuelType ? [filters.fuelType] : []
                      }
                      hasActiveFilters={filters.count > 0}
                      clearFiltersHref={filters.clearAllFiltersHref}
                    />
                  </div>
                  <Pagination
                    page={filters.page}
                    totalPages={totalPages}
                    pageRange={1}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    totalItems={totalItems}
                  />
                  <div className="self-end">
                    <BackToTop />
                  </div>
                </>
              )}
              {!hasSearched && (
                <StationList
                  stations={[]}
                  totalItems={0}
                  hasSearched={false}
                  selectedFuelTypes={[]}
                />
              )}
            </div>
          </div>
          {hasSearched && totalItems > 0 && (
            <ToolFeedback key={router.asPath} />
          )}
          <div className="flex flex-col justify-between py-6 mt-8 border-t print:hidden t-social-sharing sm:flex-row border-slate-400">
            <SocialShareTool
              url={canonicalUrl}
              title={z({
                en: 'Share this tool',
                cy: 'Rhannwch yr offeryn hwn',
              })}
              subject={z({
                en: 'Find cheaper fuel near you with our Fuel Finder tool',
                cy: "Dewch o hyd i danwydd rhatach yn agos atoch chi gyda'n teclyn Canfod Tanwydd",
              })}
              xTitle={z({
                en: 'Find cheaper fuel near you with our Fuel Finder tool',
                cy: "Dewch o hyd i danwydd rhatach yn agos atoch chi gyda'n teclyn Canfod Tanwydd",
              })}
            />
          </div>
        </div>
      </form>
    </GridContainer>
  );
};

export default FuelFinder;
