import { Link } from '@maps-react/common/components/Link';

import Account from './Account';
import { CompareAccountsProps } from './CompareAccounts';

const Accounts = ({ accounts, totalItems }: CompareAccountsProps) => {
  return (
    <div className="mb-3">
      <div className="space-y-8">
        {totalItems === 0 && (
          <div className="p-3 border">
            <div className="max-w-lg text-gray-900 text-md">
              <div className="mb-3">
                There are no results that match your selected filters and search
                terms.
              </div>
              <div>
                Update your filters and search terms by removing tags in the
                applied filters section above. Or you can{' '}
                <Link href="?">reset the filters</Link> and start over.
              </div>
            </div>
          </div>
        )}
        {accounts.map((account) => (
          <Account key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
};

export default Accounts;
