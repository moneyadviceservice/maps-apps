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
import { useFilterLoading } from '../../utils/FuelFinder/hooks/useFilterLoading';
import type { StationSearchResult } from '../../utils/FuelFinder/types';
import ActiveFilters from '../ActiveFilters';
import NextSteps from '../NextSteps';
import OtherTools from '../OtherTools';
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
  const { isFilterLoading } = useFilterLoading();
  const { z } = useTranslation();
  const lang = useLanguage();

  const canonicalUrl = `https://www.moneyhelper.org.uk/${lang}/everyday-money/budgeting/petrol-price-finder`;

  const totalPages = Math.max(1, Math.ceil(totalItems / filters.perPage));
  const startIndex = (filters.page - 1) * filters.perPage;
  const endIndex = Math.min(startIndex + stations.length, totalItems);

  const fuelTypeLabel = fuelTypeOptions(z)
    .find((o) => o.value === filters.fuelType)
    ?.title?.replace(/^./, (c) => c.toLowerCase());

  const stationsInformation = (
    <StationsInformation
      totalItems={totalItems}
      fetchedAt={fetchedAt}
      fuelTypeLabel={fuelTypeLabel}
      hasActiveFilters={filters.count > 0}
      clearFiltersHref={filters.clearAllFiltersHref}
    />
  );

  return (
    <GridContainer>
      <form method="get" className="w-full col-span-12">
        <div className="flex flex-col">
          {hasSearched && (
            <div className="lg:hidden">{stationsInformation}</div>
          )}
          <div className="flex-row w-full lg:flex lg:space-x-6">
            <div className="mb-9 lg:w-[300px] lg:min-w-[300px]">
              <RefineSearch />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              {hasSearched && (
                <>
                  <div className="hidden lg:block">{stationsInformation}</div>
                  {totalItems > 0 && (
                    <div className="flex flex-col gap-y-4">
                      {filters.count > 0 && <ActiveFilters />}
                      <div className="space-y-4">
                        <SortBar />
                        <StationList
                          stations={stations}
                          selectedFuelTypes={
                            filters.fuelType ? [filters.fuelType] : []
                          }
                          isLoading={isFilterLoading}
                          skeletonCount={stations.length || filters.perPage}
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
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <NextSteps />
          <OtherTools />
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
                en: 'Find cheaper fuel near you with our Petrol price finder',
                cy: 'Dewch o hyd i danwydd rhad yn agos atoch chi gyda’n Canfyddwr prisiau petrol.',
              })}
              xTitle={z({
                en: 'Find cheaper fuel near you with our Petrol price finder',
                cy: 'Dewch o hyd i danwydd rhad yn agos atoch chi gyda’n Canfyddwr prisiau petrol.',
              })}
            />
          </div>
        </div>
      </form>
    </GridContainer>
  );
};

export default FuelFinder;
