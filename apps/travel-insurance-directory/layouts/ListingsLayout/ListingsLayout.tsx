import { FilterOptions } from 'components/FilterOptions';
import { FirmSummary, FirmSummarySkeleton } from 'components/FirmSummary';
import { ResultsSummary } from 'components/ResultsSummary';
import { ViewPerPage } from 'components/ViewPerPage';
import { page } from 'data/pages/landing';
import { exportCopy } from 'data/pages/listings/export';
import { twMerge } from 'tailwind-merge';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';
import { buildListingsSearchParams } from 'utils/listingsPageFilters';
import type { QueryParams } from 'utils/query/queryHelpers';

import { BackLink } from '@maps-react/common/components/BackLink';
import { BackToTop } from '@maps-react/common/components/BackToTop';
import { Button } from '@maps-react/common/components/Button';
import { Heading } from '@maps-react/common/components/Heading';
import Pagination from '@maps-react/common/components/Pagination';
import { ToolFeedback } from '@maps-react/common/components/ToolFeedback';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { type Pagination as PaginationType } from '@maps-react/utils/pagination';

export type ListingsLayoutProps = {
  lang: 'en' | 'cy';
  query: QueryParams;
  firms: TravelInsuranceFirmDocument[];
  pagination: PaginationType | null;
  showResultsSection: boolean;
  isFilterLoading?: boolean;
  onFormChange?: (e: React.ChangeEvent<HTMLFormElement>) => void;
};

const SKELETON_COUNT = 5;

export const ListingsLayout = ({
  lang,
  query,
  firms,
  pagination,
  showResultsSection,
  isFilterLoading = false,
  onFormChange,
}: ListingsLayoutProps) => {
  const { z } = useTranslation();
  const exportSearchParams = (() => {
    const params = buildListingsSearchParams(query);
    params.set('lang', lang);
    return params.toString();
  })();

  return (
    <Container className="max-w-[1272px] mx-auto px-4 md:px-6 lg:px-8 pt-4">
      <BackLink href={`/${lang}`}>{page.singles.back(z)}</BackLink>

      <Heading level="h1" className="text-gray-800 my-6">
        {page.heading(z)}
      </Heading>

      <form
        id="filter-menu"
        action="/api/listings/apply"
        method="post"
        onChange={onFormChange}
        data-testid="listings-form"
      >
        <input type="hidden" name="lang" value={lang} />
        <div className={twMerge('mt-6 flex flex-col lg:flex-row lg:gap-8')}>
          <FilterOptions lang={lang} query={query} />
          <div className="flex-1 min-w-0 mt-6 lg:mt-0">
            {showResultsSection && !!pagination?.totalItems && (
              <div className="space-y-4">
                {pagination && (
                  <ResultsSummary
                    startIndex={pagination.startIndex}
                    endIndex={pagination.endIndex}
                    totalItems={pagination.totalItems}
                  />
                )}
                <div className="sm:flex items-center justify-between">
                  <ViewPerPage query={query} lang={lang} />
                  <Button
                    variant="secondary"
                    as="a"
                    href={`/api/listings/export-firms?${exportSearchParams}`}
                    download="travel-insurance-firms.pdf"
                    className="block mt-4 sm:mt-0"
                    data-testid="download-all-firms"
                  >
                    {z(exportCopy.downloadButton)}
                  </Button>
                </div>
              </div>
            )}
            <div className="space-y-6 my-6">
              {isFilterLoading
                ? Array.from(
                    { length: Math.max(firms.length, SKELETON_COUNT) },
                    (_, i) => <FirmSummarySkeleton key={i} />,
                  )
                : firms.map((firm) => (
                    <FirmSummary key={firm.fca_number} firm={firm} />
                  ))}
            </div>
            <ToolFeedback />
            {pagination && <Pagination {...pagination} />}
            <div className="mt-8">
              <BackToTop />
            </div>
          </div>
        </div>
      </form>
    </Container>
  );
};
