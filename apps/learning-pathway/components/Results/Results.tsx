import DocumentCard from 'components/DocumentCard/DocumentCard';
import EmptyResults from 'components/EmptyResults/EmptyResults';
import { DetailsPagesListModel } from 'lib/types/site.type';

import AccountPagination, {
  PaginationProps,
} from '@maps-react/common/components/Pagination';

type ResultsType = PaginationProps & {
  sortedCards: DetailsPagesListModel[];
};

const Results = ({
  sortedCards,
  page,
  totalPages,
  startIndex,
  endIndex,
  totalItems,
}: ResultsType) => {
  return sortedCards.length > 0 ? (
    <div className="space-y-8">
      {sortedCards.map((details) => (
        <DocumentCard key={details.slug} details={details} />
      ))}
      <AccountPagination
        page={page}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={totalItems}
      />
    </div>
  ) : (
    <EmptyResults />
  );
};

export default Results;
