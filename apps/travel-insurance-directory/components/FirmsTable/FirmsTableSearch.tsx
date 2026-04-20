import { Button } from '@maps-react/common/components/Button';
import { TextInput } from '@maps-react/form/components/TextInput';

export type FirmsTableSearchProps = {
  principalName?: string | null;
  fcaNumber?: string | null;
  firmName?: string | null;
};

export const FirmsTableSearch = ({
  principalName,
  fcaNumber,
  firmName,
}: FirmsTableSearchProps) => {
  return (
    <form
      method="get"
      action="/admin/dashboard"
      className="bg-gray-95 rounded p-4 mb-6"
      data-testid="firms-search-form"
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-end">
        <div className="[&>label]:text-[16px] [&>label]:leading-none [&>input]:text-[16px] [&>input]:leading-none">
          <TextInput
            id="fcaNumber"
            name="fcaNumber"
            label="Find by FCA Number"
            defaultValue={fcaNumber ?? ''}
            placeholder="Find by FCA Number"
          />
        </div>
        <div className="[&>label]:text-[16px] [&>label]:leading-none [&>input]:text-[16px] [&>input]:leading-none">
          <TextInput
            id="firmName"
            name="firmName"
            label="Search Firm Names"
            defaultValue={firmName ?? ''}
            placeholder="Search Firm Names"
          />
        </div>
        <div className="[&>label]:text-[16px] [&>label]:leading-none [&>input]:text-[16px] [&>input]:leading-none">
          <TextInput
            id="principalName"
            name="principalName"
            label="Search Principal Names"
            defaultValue={principalName ?? ''}
            placeholder="Search Principal Names"
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
