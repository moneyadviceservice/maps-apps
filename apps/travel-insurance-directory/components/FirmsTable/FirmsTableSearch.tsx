import type { SortDir } from 'types/admin';

import { Button } from '@maps-react/common/components/Button';
import { TextInput } from '@maps-react/form/components/TextInput';

export type FirmsTableSearchProps = {
  principalName?: string | null;
  fcaNumber?: string | null;
  firmName?: string | null;
  /** Preserved on submit so column sort survives a new search (GET form only posts visible fields). */
  sortBy?: string | null;
  sortDir?: SortDir;
};

export const FirmsTableSearch = ({
  principalName,
  fcaNumber,
  firmName,
  sortBy,
  sortDir = 'asc',
}: FirmsTableSearchProps) => {
  return (
    <form
      method="get"
      action="/admin/dashboard"
      className="bg-gray-95 rounded p-4 mb-6"
      data-testid="firms-search-form"
    >
      {sortBy ? (
        <>
          <input type="hidden" name="sortBy" value={sortBy} />
          <input type="hidden" name="sortDir" value={sortDir} />
        </>
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-end">
        <div className="[&>label]:text-[16px] [&>label]:leading-none [&>input]:text-[16px] [&>input]:leading-none">
          <TextInput
            id="fcaNumber"
            name="fcaNumber"
            label="Find by FCA Number"
            defaultValue={fcaNumber ?? ''}
            placeholder="Find by FCA Number"
            data-testid="fca-number"
          />
        </div>
        <div className="[&>label]:text-[16px] [&>label]:leading-none [&>input]:text-[16px] [&>input]:leading-none">
          <TextInput
            id="firmName"
            name="firmName"
            label="Search Firm Names"
            defaultValue={firmName ?? ''}
            placeholder="Search Firm Names"
            data-testid="firm-name"
          />
        </div>
        <div className="[&>label]:text-[16px] [&>label]:leading-none [&>input]:text-[16px] [&>input]:leading-none">
          <TextInput
            id="principalName"
            name="principalName"
            label="Search Principal Names"
            defaultValue={principalName ?? ''}
            placeholder="Search Principal Names"
            data-testid="principal-name"
          />
        </div>
        <div>
          <Button
            type="submit"
            data-testid="firms-search-button"
            className="h-10"
          >
            Search
          </Button>
        </div>
      </div>
    </form>
  );
};
