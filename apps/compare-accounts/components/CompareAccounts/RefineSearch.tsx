import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { twMerge } from 'tailwind-merge';

import HyphenIcon from '@maps-react/common/assets/images/hyphen.svg';
import Plus from '@maps-react/common/assets/images/plus.svg';
import Spinner from '@maps-react/common/assets/images/spinner.svg';
import { Button } from '@maps-react/common/components/Button';
import { Link } from '@maps-react/common/components/Link';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import {
  accountAccess,
  accountFeatures,
  accountTypes,
} from '../../data/compare-accounts';
import pageFilters from '../../utils/CompareAccounts/pageFilters';
import FilterSection from './FilterSection';
import Label from './Label';
import SearchInput from './SearchInput';

const RefineSearch = () => {
  const [showRefineSearch, setShowRefineSearch] = useState(true);
  const [loading, setLoading] = useState(false);
  const { z } = useTranslation();

  const router = useRouter();
  const filters = pageFilters(router);

  const [searchValue, setSearchValue] = useState(filters.searchQuery);

  useEffect(() => {
    setShowRefineSearch(false);
    setSearchValue(filters.searchQuery);
  }, [filters.searchQuery]);

  const allAccountTypes = accountTypes(z);
  const allAccountAccess = accountAccess(z);
  const allAccountFeatures = accountFeatures(z);

  return (
    <div className="overflow-hidden border rounded-md t-refine-search border-slate-400 border-grey-500">
      <div className="hidden w-full px-6 py-5 text-gray-800 bg-gray-100 lg:grid lg:grid-cols-2">
        <div
          className="text-left font-bold text-[22px]"
          data-testid="header-filters"
        >
          {z({ en: 'Filters', cy: 'Hidlwyr' })}
        </div>
        <div className="flex items-center justify-self-end">
          <Link href={filters.clearFiltersHref()} scroll={false}>
            {z({ en: 'Clear all', cy: 'Clirio popeth' })}
          </Link>
        </div>
      </div>
      {/* Filters Button for mobile screens */}
      <button
        type="button"
        className="flex py-1.5 lg:hidden items-center justify-center w-full bg-gray-100 px-5 lg:px-6 lg:py-5 font-bold text-xl text-gray-900 gap-x-2.5 focus-visible:border-2 focus-visible:border-[#3f74e8] focus:ring-2 focus:ring-[#3f74e8] rounded-md"
        onClick={() => setShowRefineSearch((s) => !s)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setShowRefineSearch((s) => !s);
          }
        }}
        aria-expanded={showRefineSearch}
        tabIndex={0}
        data-testid="button-filters"
      >
        {showRefineSearch ? <HyphenIcon /> : <Plus />}
        <div>Filters</div>
      </button>

      <div
        className={twMerge(
          'p-6',
          showRefineSearch ? 'block' : 'hidden',
          'lg:block',
        )}
        id="refine-search"
        data-testid="refine-search"
      >
        <div className="space-y-5">
          <div className="">
            <Label htmlFor="search">
              {z({
                en: 'Account or bank name',
                cy: 'Enw cyfrif neu banc',
              })}
            </Label>
            <SearchInput
              id={'search'}
              name="q"
              className="w-full t-search"
              value={searchValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchValue(e.target.value)
              }
            />
          </div>
          <FilterSection
            title={z({ en: 'Account type', cy: 'Math o gyfrif' })}
            items={allAccountTypes}
          />
          <FilterSection
            title={z({ en: 'Account features', cy: 'Nodweddion cyfrif' })}
            items={allAccountFeatures}
          />
          <FilterSection
            title={z({ en: 'Account access', cy: 'Mynediad cyfrif' })}
            items={allAccountAccess}
          />
          <Button
            variant={loading ? 'loading' : 'primary'}
            iconLeft={loading ? <Spinner className="animate-spin" /> : null}
            onClick={() => setLoading(true)}
            analyticsClassName={'tool-nav-submit tool-nav-complete'}
            data-testid="apply-filters-button"
          >
            {z({ en: 'Apply filters', cy: 'Gosod hidlyddion' })}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RefineSearch;
