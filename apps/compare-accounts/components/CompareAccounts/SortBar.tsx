import { useRouter } from 'next/router';

import { Select } from '@maps-react/form/components/Select';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import pageFilters from '../../utils/CompareAccounts/pageFilters';

const SortBar = () => {
  const router = useRouter();
  const filters = pageFilters(router);
  const { z } = useTranslation();

  // Define the possible keys as a union type
  type TranslatedOptionKey =
    | 'random'
    | 'providerNameAZ'
    | 'providerNameZA'
    | 'monthlyAccountFeeLowestFirst'
    | 'minimumMonthlyDepositLowestFirst'
    | 'arrangedOverdraftRateLowestFirst'
    | 'unarrangedMaximumMonthlyChargeLowestFirst';

  const translatedOptions: Record<
    TranslatedOptionKey,
    { en: string; cy: string }
  > = {
    random: { en: 'Random', cy: 'Ar hap' },
    providerNameAZ: { en: 'Bank name A-Z', cy: 'Enw banc A-Z' },
    providerNameZA: { en: 'Bank name Z-A', cy: 'Enw banc Z-A' },
    monthlyAccountFeeLowestFirst: {
      en: 'Monthly account fee (lowest first)',
      cy: 'Ffi cyfrif misol (lleiaf yn gyntaf)',
    },
    minimumMonthlyDepositLowestFirst: {
      en: 'Minimum monthly deposit (lowest first)',
      cy: 'Isafswm blaendal misol (lleiaf yn gyntaf)',
    },
    arrangedOverdraftRateLowestFirst: {
      en: 'Arranged overdraft rate (lowest first)',
      cy: "Cyfradd gorddrafft wedi'i drefnu (lleiaf yn gyntaf)",
    },
    unarrangedMaximumMonthlyChargeLowestFirst: {
      en: 'Unarranged maximum monthly charge (lowest first)',
      cy: 'Uchafswm tâl misol heb ei drefnu (lleiaf yn gyntaf)',
    },
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-2 lg:flex-row">
        <div className="flex items-center space-x-4">
          <label htmlFor="accountsPerPage" className="text-lg text-gray-800">
            {z({ en: 'View per page', cy: 'Golwg fesul dudalen' })}
          </label>
          <Select
            className="lg:min-w-[100px] grow"
            defaultValue={'5'}
            value={String(filters.accountsPerPage)}
            defaultChecked={true}
            id="accountsPerPage"
            name="accountsPerPage"
            onChange={(e) => filters.setAccountsPerPage(e.target.value)}
            options={[
              { text: '5', value: '5' },
              { text: '10', value: '10' },
              { text: '20', value: '20' },
            ]}
          />
        </div>

        <div className="flex items-center space-x-4 t-sort">
          <label
            htmlFor="order"
            className="text-lg text-gray-800 whitespace-nowrap"
          >
            {z({ en: 'Sort results by', cy: 'Trefnu' })}
          </label>
          <div className="grow">
            <Select
              id="order"
              name="order"
              className="truncate"
              hideEmptyItem={true}
              value={filters.order}
              onChange={(e) => {
                filters.setOrder(e.target.value);
              }}
              options={[
                'random',
                'providerNameAZ',
                'providerNameZA',
                'monthlyAccountFeeLowestFirst',
                'minimumMonthlyDepositLowestFirst',
                'arrangedOverdraftRateLowestFirst',
                'unarrangedMaximumMonthlyChargeLowestFirst',
              ].map((v) => ({
                text: translatedOptions[v as TranslatedOptionKey].en,
                value: v,
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortBar;
