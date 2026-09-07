import LinkArrow from '@maps-react/common/assets/images/link-arrow.svg';
import { H3, H4 } from '@maps-react/common/components/Heading';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';
import { Link } from '@maps-react/common/components/Link';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import formatMoney from '../../../utils/CompareAccounts/formatMoney';
import formatPercentage from '../../../utils/CompareAccounts/formatPercentage';
import AccountExpandedView from '../AccountExpandedView';
import type { AccountProps } from '../CompareAccounts';

type AccountExpandedViewProps = {
  account: AccountProps;
};

const Account = ({ account }: AccountExpandedViewProps) => {
  const { z } = useTranslation();

  const extractAccountDetails = (account: AccountProps) => {
    return [
      {
        title: z({ en: 'Monthly account fee', cy: 'Ffi cyfrif misol' }),
        value: formatMoney(account.monthlyFee),
      },
      {
        title: z({
          en: 'Min. monthly deposit requirement',
          cy: 'Isafswm. blaendal misol sydd ei angen',
        }),
        value: formatMoney(account.minimumMonthlyCredit),
      },
      {
        title: z({
          en: 'Arranged overdraft interest rate',
          cy: "Cyfradd llog gorddrafft wedi'i drefnu ",
        }),
        value:
          account.representativeAPR > 0
            ? formatPercentage(account.representativeAPR)
            : z({ en: 'Not offered', cy: 'Nid yw wedi’i gynnig' }),
      },
      {
        title: z({
          en: 'Unarranged overdraft max. monthly charge',
          cy: 'Uchafswm tâl gorddrafft misol heb ei drefnu',
        }),
        value: (() => {
          if (account.unauthODMonthlyCap === null) {
            return 'No limit';
          }
          if (account.unauthODMonthlyCap.amount === 0) {
            return z({
              en: 'Not offered',
              cy: 'Nid yw wedi’i gynnig',
            });
          }
          return formatMoney(account.unauthODMonthlyCap);
        })(),
      },
    ];
  };
  const details = extractAccountDetails(account);

  return (
    <InformationCallout testClass="account" variant="withShadow">
      <div data-testid="selected-accounts" className="px-6 pt-6 pb-8">
        <div className="space-y-2">
          <H3 color="text-blue-700">{account.providerName}</H3>

          <H4
            data-testid="acc-sub-title"
            className="mb-4 text-lg text-gray-800 t-name"
          >
            {account.name}
          </H4>
          <div className="t-visit-provider-link ">
            <Link
              withIcon={false}
              href={account.url}
              target="_blank"
              rel="noreferrer"
              title={z(
                {
                  en: 'Visit website for provider named {name}',
                  cy: 'Ewch i wefan y darparwr sydd wedi’i enwi {name}',
                },
                { name: account.providerName },
              )}
            >
              <div className="flex items-center space-x-1 bg-inherit">
                <div>
                  <span>
                    {z({
                      en: 'Visit provider website',
                      cy: 'Ymweld â gwefan darparwr',
                    })}
                  </span>
                </div>

                <span className="sr-only">(opens in a new window)</span>
                <div>
                  <LinkArrow />
                </div>
              </div>
            </Link>
          </div>
        </div>
        <table className="w-full mt-8 mb-4 table-fixed t-details md:hidden">
          <tbody>
            {details.map(({ title, value }) => (
              <tr
                key={title + value}
                className="border-b border-slate-400"
                role="row"
              >
                <td className="py-2 pr-3 font-normal text-gray-700 t-title">
                  {title}
                </td>
                <td
                  className="t-value text-[19px] font-semibold"
                  aria-label={title}
                >
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="hidden mt-8 mb-4 t-details md:block">
          <table className="w-full text-gray-800 border-collapse">
            <thead>
              <tr className="divide-x-2 border-slate-400">
                {details.map(({ title }, index) => (
                  <th
                    key={title}
                    className={`t-title w-1/4 px-6 pb-0 text-left font-normal leading-[23px] align-top ${
                      index === 0 ? 'first:pl-0' : ''
                    }`}
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="divide-x-2 border-slate-400">
                {details.map(({ value }, i) => (
                  <td
                    key={i}
                    data-testid={`table-data-value-${i}`}
                    className={`t-value px-6 pt-2 text-[19px] w-1/4 font-semibold leading-[25px] ${
                      i === 0 ? 'first:pl-0' : ''
                    }`}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <AccountExpandedView account={account} />
      </div>
    </InformationCallout>
  );
};

export default Account;
