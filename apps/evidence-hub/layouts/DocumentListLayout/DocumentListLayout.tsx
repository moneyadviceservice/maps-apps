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
import { Pagination as PaginationType } from 'utils/pagination/paginationUtils';
import {
  buildQueryWithDefaults,
  hasKeyword,
  QueryParams,
} from 'utils/query/queryHelpers';
import { convertFormDataToObject } from 'utils/ui/formHelpers';
import { v4 } from 'uuid';

import { H2 } from '@maps-react/common/components/Heading';
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Detect which submit button was clicked and add its name/value to form data
    // This is needed to distinguish between "Search" and "Apply filters" buttons
    const submitter = (e.nativeEvent as SubmitEvent).submitter;
    if (submitter && submitter instanceof HTMLButtonElement) {
      const buttonName = submitter.name;
      const buttonValue = submitter.value;
      if (buttonName) {
        formData.append(buttonName, buttonValue || '');
      }
    }

    const redirectUrl = buildRedirectUrl(convertFormDataToObject(formData));
    // Replace hardcoded '/en/' with the actual language
    const localizedUrl = redirectUrl.replace(/^\/en\//, `/${lang}/`);
    // Use Next.js router for client-side navigation
    router.push(localizedUrl);
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
}: {
  documents: DocumentTemplate[];
  lang: string;
  pagination?: PaginationType;
  query: QueryParams;
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

  return (
    <div className="flex-1">
      <div className="max-w-4xl">
        {hasDocuments ? (
          <div className="space-y-8">
            <div className="mb-8">
              <p className="text-xl font-bold">
                {pagination ? pagination.totalItems : documents.length} document
                {(pagination ? pagination.totalItems : documents.length) === 1
                  ? ''
                  : 's'}{' '}
                found
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <PaginationFilter
                name="limit"
                value={pagination?.itemsPerPage || 10}
              />
              <SortFilter
                value={currentOrder}
                hasKeyword={hasKeywordValue}
                name="order"
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
          <div className="mb-12 flex justify-end">
            <BackToTop />
          </div>
        )}
      </div>
    </div>
  );
};
