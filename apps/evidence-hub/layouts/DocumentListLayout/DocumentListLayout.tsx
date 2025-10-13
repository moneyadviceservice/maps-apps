import { DocumentSummary } from 'components/DocumentSummary';
import { SideNavigation } from 'components/SideNavigation';
import { twMerge } from 'tailwind-merge';
import { DocumentTemplate, Tag } from 'types/@adobe/page';
import { v4 } from 'uuid';

import { H2 } from '@maps-react/common/components/Heading';

interface DocumentListLayoutProps {
  documents: DocumentTemplate[];
  lang: string;
  tags: {
    label: string;
    tags: Tag[];
  }[];
  query: Record<string, string | string[] | undefined>;
}

export const DocumentListLayout = ({
  documents,
  lang,
  tags,
  query,
}: DocumentListLayoutProps) => {
  return (
    <div
      className={twMerge(['mt-8 lg:mt-12 flex flex-col lg:flex-row lg:gap-8'])}
    >
      <SideNavigation tags={tags} query={query} className="flex-shrink-0" />
      <div className="flex-1">
        <div className="max-w-4xl">
          {documents.length === 0 ? (
            <div className="py-12">
              <H2 className="mb-16">
                We’re sorry, no results have been found for your search.
              </H2>
              <p className="mb-6">Improve your search by:</p>
              <ul className="list-disc list-inside">
                <li>double-checking your spelling.</li>
                <li>using fewer filters.</li>
                <li>trying more general keywords</li>
                <li>trying different keywords.</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="mb-8">
                <p className="text-xl font-bold text-gray-600">
                  {documents.length} document
                  {documents.length === 1 ? '' : 's'} found
                </p>
              </div>

              {documents.map((doc: DocumentTemplate) => (
                <DocumentSummary key={v4()} doc={doc} lang={lang} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
