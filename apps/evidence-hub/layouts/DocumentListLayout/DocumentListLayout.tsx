import { ChangeEvent } from 'react';

import { useRouter } from 'next/router';

import { BackToTop } from '@maps-react/common/components/BackToTop';
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

import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
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

    if (name === 'limit' || name === 'order') {
      delete updatedQuery.p;
    }

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
              <Heading
                level="h5"
                component={'h2'}
                tabIndex={0}
                data-testid="research-library-results-count"
              >
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
              <DocumentSummary key={doc.slug} doc={doc} lang={lang} />
            ))}

            {pagination && pagination.totalPages > 1 && (
              <Pagination {...pagination} />
            )}
          </div>
        ) : (
          <div className="py-12">
            <Heading level="h5" component="h2" className="mb-4">
              Can&apos;t find what you&apos;re looking for?
            </Heading>
            <p>
              Email{' '}
              <Link href="mailto:what.works@maps.org.uk">
                what.works@maps.org.uk
              </Link>{' '}
              with the topic you&apos;re researching, and we&apos;ll see if we
              can help.
            </p>
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
