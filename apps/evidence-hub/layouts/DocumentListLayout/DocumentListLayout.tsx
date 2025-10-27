import { BackToTop } from 'components/BackToTop';
import { DocumentSummary } from 'components/DocumentSummary';
import { Pagination } from 'components/Pagination/Pagination';
import { PaginationFilter } from 'components/PaginationFilter';
import { SideNavigation } from 'components/SideNavigation';
import { twMerge } from 'tailwind-merge';
import { DocumentTemplate, TagGroup } from 'types/@adobe/page';
import { Pagination as PaginationType } from 'utils/pagination/paginationUtils';
import { v4 } from 'uuid';

import { H2 } from '@maps-react/common/components/Heading';

interface DocumentListLayoutProps {
  documents: DocumentTemplate[];
  lang: string;
  tags: TagGroup[];
  query: Record<string, string | string[] | undefined>;
  pagination: PaginationType;
  onPageChange?: (page: number) => void;
  onLimitChange: (limit: number) => void;
  baseUrl?: string; // Base URL for server-side pagination
}

export const DocumentListLayout = ({
  documents,
  lang,
  tags,
  query,
  pagination,
  onPageChange,
  onLimitChange,
  baseUrl,
}: DocumentListLayoutProps) => {
  const hasDocuments = documents.length > 0;
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();

    // Get all form data and group by field name
    const groupedData: Record<string, string[]> = {};

    for (const [key, value] of formData.entries()) {
      if (value && typeof value === 'string' && value.trim() !== '') {
        if (!groupedData[key]) {
          groupedData[key] = [];
        }
        groupedData[key].push(value.trim());
      }
    }

    // Convert grouped data to comma-separated values
    for (const [key, values] of Object.entries(groupedData)) {
      if (values.length > 0) {
        // Remove duplicates and join with commas
        const uniqueValues = [...new Set(values)];
        params.set(key, uniqueValues.join(','));
      }
    }

    // Navigate to the new URL
    const newUrl = `/${lang}/evidence-library?${params.toString()}`;
    globalThis.location.href = newUrl;
  };
  return (
    <form
      onSubmit={handleSubmit}
      method="GET"
      action={`/${lang}/evidence-library`}
      data-testid="document-list-form"
    >
      <div className={twMerge(['mt-6 flex flex-col lg:flex-row lg:gap-8'])}>
        <SideNavigation
          lang={lang}
          tags={tags}
          query={query}
          className="flex-shrink-0"
        />
        <div className="flex-1">
          <div className="max-w-4xl">
            {hasDocuments ? (
              <div className="space-y-8">
                <div className="mb-8">
                  <p className="text-xl font-bold">
                    {pagination ? pagination.totalItems : documents.length}{' '}
                    document
                    {(pagination ? pagination.totalItems : documents.length) ===
                    1
                      ? ''
                      : 's'}{' '}
                    found
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <PaginationFilter
                    name="limit"
                    value={pagination?.itemsPerPage || 10}
                    onChange={onLimitChange}
                  />
                </div>

                {documents.map((doc: DocumentTemplate) => (
                  <DocumentSummary key={v4()} doc={doc} lang={lang} />
                ))}

                {pagination && (
                  <Pagination
                    pagination={pagination}
                    onPageChange={onPageChange}
                    baseUrl={baseUrl}
                    query={query}
                  />
                )}
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
      </div>
    </form>
  );
};
