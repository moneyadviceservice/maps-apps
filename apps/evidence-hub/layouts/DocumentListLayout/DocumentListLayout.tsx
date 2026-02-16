import { ChangeEvent } from 'react';

import { useRouter } from 'next/router';

import { BackToTop } from 'components/BackToTop';
import { DocumentSummary } from 'components/DocumentSummary';
import { PaginationFilter } from 'components/PaginationFilter';
import {
  SideNavigationDesktop,
  SideNavigationMobile,
} from 'components/SideNavigation';
import { SortFilter } from 'components/SortFilter';
import { buildRedirectUrl } from 'pages/api/evidence-hub/filter';
import { twMerge } from 'tailwind-merge';
import { DocumentTemplate, TagGroup } from 'types/@adobe/page';
import {
  trackFilterClicks,
  trackSearchButton,
} from 'utils/analytics/trackingUtils';
import { type Pagination as PaginationType } from '@maps-react/utils/pagination';
import {
  buildQueryWithDefaults,
  hasKeyword,
  QueryParams,
} from 'utils/query/queryHelpers';
import { convertFormDataToObject } from 'utils/ui/formHelpers';
import { v4 } from 'uuid';

import { H2, Heading } from '@maps-react/common/components/Heading';
import Pagination from '@maps-react/common/components/Pagination';

interface DocumentListLayoutProps {
  documents: DocumentTemplate[];
  lang: string;
  tags: TagGroup[];
  query: QueryParams;
  pagination: PaginationType;
}

export const DocumentListLayout = ({
  documents,
  lang,
  tags,
  query,
  pagination,
}: DocumentListLayoutProps) => {
  const router = useRouter();
  const hasDocuments = documents.length > 0;
  const onFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const name = event.target.name;
    const value = event.target.value;

    const updatedQuery = {
      ...router.query,
      [name]: value,
    };

    router.push(
      {
        pathname: router.pathname,
        query: updatedQuery,
      },
      undefined,
      { scroll: false },
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let buttonName;
    // Detect which submit button was clicked and add its name/value to form data
    // This is needed to distinguish between "Search" and "Apply filters" buttons
    const submitter = (e.nativeEvent as SubmitEvent).submitter;
    if (submitter && submitter instanceof HTMLButtonElement) {
      buttonName = submitter.name;
      const buttonValue = submitter.value;
      if (buttonName) {
        formData.append(buttonName, buttonValue || '');
      }
    }

    if (buttonName === 'search') {
      const keyword = formData.get('keyword') as string;
      trackSearchButton(keyword);
    }

    if (buttonName !== 'search') {
      trackFilterClicks(formData, tags);
    }

    const redirectUrl = buildRedirectUrl(convertFormDataToObject(formData));
    // Replace hardcoded '/en/' with the actual language
    const localizedUrl = redirectUrl.replace(/^\/en\//, `/${lang}/`);
    // Use Next.js router for client-side navigation
    router.push(localizedUrl, undefined, { scroll: false });
  };
  return (
    <>
      <form
        onSubmit={handleSubmit}
        method="GET"
        action={`/api/evidence-hub/filter`}
        data-testid="document-list-form-desktop"
        className="hidden lg:block"
      >
        <div className={twMerge(['mt-6 flex flex-col lg:flex-row lg:gap-8'])}>
          <SideNavigationDesktop
            lang={lang}
            tags={tags}
            query={query}
            className="flex-shrink-0"
          />
          <Results
            documents={documents}
            lang={lang}
            pagination={hasDocuments ? pagination : undefined}
            query={query}
            onFilterChange={onFilterChange}
            formType="desktop"
          />
        </div>
      </form>
      <form
        onSubmit={handleSubmit}
        method="GET"
        action={`/api/evidence-hub/filter`}
        data-testid="document-list-form"
        className="lg:hidden"
      >
        <div className={twMerge(['mt-6 flex flex-col lg:flex-row lg:gap-8'])}>
          <SideNavigationMobile
            lang={lang}
            tags={tags}
            query={query}
            className="flex-shrink-0"
          />
          <Results
            documents={documents}
            lang={lang}
            pagination={hasDocuments ? pagination : undefined}
            query={query}
            onFilterChange={onFilterChange}
            formType="mobile"
          />
        </div>
      </form>
    </>
  );
};

const Results = ({
  documents,
  lang,
  pagination,
  query,
  onFilterChange,
  formType,
}: {
  documents: DocumentTemplate[];
  lang: string;
  pagination?: PaginationType;
  query: QueryParams;
  onFilterChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  formType: 'desktop' | 'mobile';
}) => {
  // Use query prop directly (not router.query) to work correctly in tests
  const queryWithDefaults = buildQueryWithDefaults(query);
  const hasKeywordValue = hasKeyword(query);
  const currentOrder =
    typeof queryWithDefaults.order === 'string'
      ? queryWithDefaults.order
      : hasKeywordValue
      ? 'relevance'
      : 'published';
  const hasDocuments = documents.length > 0;
  const idPrefix = formType === 'desktop' ? 'desktop' : 'mobile';

  return (
    <div className="flex-1">
      <div className="max-w-4xl">
        {hasDocuments ? (
          <div className="space-y-8">
            <div className="mb-8">
              <Heading level="h5" component={'h2'} tabIndex={0}>
                {pagination ? pagination.totalItems : documents.length} document
                {(pagination ? pagination.totalItems : documents.length) === 1
                  ? ''
                  : 's'}{' '}
                found
              </Heading>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <PaginationFilter
                name="limit"
                id={`${idPrefix}-limit`}
                value={pagination?.itemsPerPage || 10}
                onChange={onFilterChange}
              />
              <SortFilter
                value={currentOrder}
                hasKeyword={hasKeywordValue}
                name="order"
                id={`${idPrefix}-order`}
                onChange={onFilterChange}
              />
            </div>

            {documents.map((doc: DocumentTemplate) => (
              <DocumentSummary key={v4()} doc={doc} lang={lang} />
            ))}

            {pagination && <Pagination {...pagination} />}
          </div>
        ) : (
          <div className="py-12">
            <H2 className="mb-16">
              We&apos;re sorry, no results have been found for your search.
            </H2>
            <p className="mb-6">Improve your search by:</p>
            <ul className="list-disc list-inside">
              <li>double-checking your spelling.</li>
              <li>using fewer filters.</li>
              <li>trying more general keywords</li>
              <li>trying different keywords.</li>
            </ul>
          </div>
        )}
        {hasDocuments && (
          <div className="my-12 flex justify-end">
            <BackToTop />
          </div>
        )}
      </div>
    </div>
  );
};
