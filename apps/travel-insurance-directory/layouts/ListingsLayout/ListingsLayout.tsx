import { FirmSummary } from 'components/FirmSummary';
import { ResultsSummary } from 'components/ResultsSummary';
import { ViewPerPage } from 'components/ViewPerPage';
import { page } from 'data/pages/landing';
import { twMerge } from 'tailwind-merge';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';
import type { QueryParams } from 'utils/query/queryHelpers';

import { BackLink } from '@maps-react/common/components/BackLink';
import { Heading } from '@maps-react/common/components/Heading';
import Pagination from '@maps-react/common/components/Pagination';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { type Pagination as PaginationType } from '@maps-react/utils/pagination';

export type ListingsLayoutProps = {
  lang: 'en' | 'cy';
  query: QueryParams;
  firms: TravelInsuranceFirmDocument[];
  pagination: PaginationType | null;
  showResultsSection: boolean;
  onFormChange?: (e: React.ChangeEvent<HTMLFormElement>) => void;
};

export const ListingsLayout = ({
  lang,
  query,
  firms,
  pagination,
  showResultsSection,
  onFormChange,
}: ListingsLayoutProps) => {
  const { z } = useTranslation();

  return (
    <Container className="max-w-[1272px] mx-auto px-4 md:px-6 lg:px-8 pt-4">
      <BackLink href={`/${lang}`}>{page.singles.back(z)}</BackLink>

      <Heading level="h1" className="text-gray-800 my-6">
        {z({
          en: 'Find a travel insurance provider if you have a serious medical condition or disability',
          cy: 'Canfod darparwr yswiriant os oes gennych yswiriad meddygol neu ddiswyl',
        })}
      </Heading>

      <form
        action="/api/listings/apply"
        method="post"
        onChange={onFormChange}
        data-testid="listings-form"
      >
        <input type="hidden" name="lang" value={lang} />
        <div className={twMerge('mt-6 flex flex-col lg:flex-row lg:gap-8')}>
          <div className="flex-1 min-w-0 mt-6 lg:mt-0">
            {showResultsSection && (
              <div className="space-y-4 mb-6">
                {pagination && (
                  <ResultsSummary
                    startIndex={pagination.startIndex}
                    endIndex={pagination.endIndex}
                    totalItems={pagination.totalItems}
                  />
                )}
                <ViewPerPage query={query} />
              </div>
            )}
            <div className="space-y-6 mb-6">
              {firms.map((firm) => (
                <FirmSummary key={firm.fca_number} firm={firm} />
              ))}
            </div>
            {pagination && <Pagination {...pagination} />}
          </div>
        </div>
      </form>
    </Container>
  );
};
