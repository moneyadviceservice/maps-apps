import { useRouter } from 'next/router';

import { format } from 'date-fns';

import ArrowUp from '@maps-react/common/assets/images/arrow-up.svg';
import { ToolFeedback } from '@maps-react/common/components/ToolFeedback';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import FocusLink, { Action } from '../../components/FocusLink';
import calculatePagination from '../../utils/CompareAccounts/calculatePagination';
import pageFilters from '../../utils/CompareAccounts/pageFilters';
import ActiveFilters from '../CompareAccounts/ActiveFilters';
import RefineSearch from '../CompareAccounts/RefineSearch';
import Pagination from '../Pagination';
import Accounts from './Accounts';
import SortBar from './SortBar';

export type Currency = {
  amount: number;
  currency: string;
  scale: number;
};

export type AccountProps = {
  id: string;
  name: string;
  providerName: string;
  access: string[];
  arrangedODDetailBrochure: string;
  arrangedODExample1: Currency;
  arrangedODExample2: Currency;
  atmEU50Cost: Currency;
  atmMaxFreeWithdrawalUK: number | null;
  atmWithdrawalCharge: Currency;
  atmWithdrawalChargePercent: number;
  atmWorld50Cost: Currency;
  bacsCharge: Currency;
  chapsCharge: Currency;
  debitCardIssueFee: Currency;
  debitCardReplacementFee: Currency;
  debitCardReplacementFeeBrochure: string | null;
  debitEU50Cost: Currency;
  debitWorld50Cost: Currency;
  directDebitCharge: Currency;
  fasterPaymentsCharge: Currency;
  features: string[];
  intCashWithdrawDetail: string;
  intDebitCardPayDetail: string;
  intPaymentsInDetail: string;
  intPaymentsOutDetail: string;
  minimumMonthlyCredit: Currency;
  minimumMonthlyCreditBrochure: string | null;
  monthlyChargeBrochure: string | null;
  monthlyFee: Currency;
  otherChargesBrochure: string;
  overdraftFacility: boolean;
  paidItemDetail: string;
  payInEUMaxChrg: Currency;
  payInEUMinChrg: Currency;
  payInWorldMaxChrg: Currency;
  payInWorldMinChrg: Currency;
  payOutEUMaxChrg: Currency;
  payOutEUMinChrg: Currency;
  payOutWorldMaxChrg: Currency;
  payOutWorldMinChrg: Currency;
  representativeAPR: number;
  standingOrderCharge: Currency;
  stoppedChequeCharge: Currency;
  transactionFee: Currency;
  transactionFeeBrochure: string | null;
  type: string;
  ukCashWithdrawalDetail: string;
  unarrangedODDetailBrochure: string;
  unauthODMonthlyCap: Currency | null;
  unauthorisedOverdraftEar: number;
  unpaidItemDetail: string;
  url: string;
};

export type CompareAccountsProps = {
  accounts: AccountProps[];
  totalItems: number;
  lastUpdated?: string;
};

const CompareAccounts = ({
  accounts,
  totalItems,
  lastUpdated,
}: CompareAccountsProps) => {
  const router = useRouter();
  const filters = pageFilters(router);
  const { z } = useTranslation();

  const pagination = calculatePagination({
    page: filters.page,
    pageSize: filters.accountsPerPage,
    totalItems,
  });

  return (
    <Container>
      <form method="get" className="mx-auto">
        <div className="flex flex-col">
          <div className="flex-row w-full lg:flex lg:space-x-6">
            <div className="mb-[35px] lg:w-[300px] lg:min-w-[300px]">
              <RefineSearch />
            </div>
            <div className="flex flex-col gap-y-[35px] lg:gap-y-8 flex-grow">
              <div className="t-accounts-information text-base text-gray-800 space-y-2.5">
                <div className="text-[38px] leading-[43px] font-bold">
                  {z(
                    { en: '{a} accounts', cy: 'Dangos {a} gyfrifon' },
                    { a: (totalItems ?? 0).toString() },
                  )}
                </div>
                <div>
                  {z({
                    en: 'Account information updated:',
                    cy: 'Manylion cyfrif wedi’i ddiweddaru:',
                  })}{' '}
                  {lastUpdated ? format(new Date(lastUpdated), 'd/M/y') : ''}
                </div>
              </div>
              {filters.count > 0 && <ActiveFilters />}
              <div className="space-y-4">
                <SortBar />

                <Accounts
                  accounts={accounts}
                  totalItems={pagination.totalItems}
                />
              </div>
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                pageRange={1}
                startIndex={pagination.startIndex}
                endIndex={pagination.endIndex}
                totalItems={pagination.totalItems}
              />

              <FocusLink
                className="self-end"
                focusID="accountsPerPage"
                action={Action.TopOfPage}
                iconRight={<ArrowUp />}
              >
                {z({ en: 'Back to top', cy: 'Nol i’r brig' })}
              </FocusLink>
            </div>
          </div>
          <ToolFeedback />
        </div>
      </form>
    </Container>
  );
};

export default CompareAccounts;
