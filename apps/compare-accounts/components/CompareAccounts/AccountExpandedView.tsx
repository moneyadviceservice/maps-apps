import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { accountAccess, accountFeatures } from '../../data/compare-accounts';
import extractExpandedAccountDetails from '../../utils/CompareAccounts/extractExpandedAccountDetails';
import AccountCheckboxes from './AccountCheckboxes';
import { AccountProps } from './CompareAccounts';
import ReadMore from './ReadMore';

type AccountExpandedViewProps = {
  account: AccountProps;
};

const AccountExpandedView = ({ account }: AccountExpandedViewProps) => {
  const { z } = useTranslation();
  const allAccountAccess = accountAccess(z);
  const allAccountFeatures = accountFeatures(z);

  return (
    <div className="space-y-4">
      <ExpandableSection
        title={z({
          en: 'Account details and fees',
          cy: 'Manylion cyfrif a ffioedd',
        })}
        variant="hyperlink"
      >
        <div className="pt-4 space-y-8">
          <AccountCheckboxes
            title={z({
              en: 'Account access options',
              cy: 'Opsiynau mynediad cyfrif',
            })}
            fields={allAccountAccess.map((a) => ({
              label: a.title,
              checked: account.access.includes(a.value),
            }))}
          />
          <AccountCheckboxes
            title={z({ en: 'Account features', cy: 'Nodweddion cyfrif' })}
            fields={allAccountFeatures.map((a) => ({
              label: a.title,
              checked: account.features.includes(a.value),
            }))}
          />
          <div>
            <div className="mb-3 text-[19px] font-bold text-gray-800">
              {z({
                en: 'Account fees and costs',
                cy: 'Ffioedd a chostau cyfrif',
              })}
            </div>
            {extractExpandedAccountDetails(account, z).map((group) => {
              return (
                <div key={group.title} className="ml-2">
                  <ExpandableSection
                    title={group.title}
                    variant="hyperlink"
                    type="nested"
                  >
                    <div className="mb-2 space-y-4 text-gray-800 bg-gray-100">
                      {group.sections.map((section, i) => {
                        return (
                          <div key={i}>
                            <table className="w-full border-collapse">
                              <caption className="px-4 mb-3 text-lg font-bold text-left">
                                {section.title || group.title}
                              </caption>
                              <thead className="sr-only">
                                <tr>
                                  <th scope="col">Fee type</th>
                                  <th scope="col">Details</th>
                                </tr>
                              </thead>
                              <tbody>
                                {section.items.map((item, i) => {
                                  return (
                                    item.value && (
                                      <tr
                                        key={i}
                                        className="border-b border-slate-400"
                                      >
                                        {item.type === 'detail' &&
                                          item.title && (
                                            <>
                                              <th
                                                scope="row"
                                                className="w-1/2 py-2 pl-4 pr-2 text-left align-top font-normal leading-[23px]"
                                              >
                                                {item.title}
                                              </th>
                                              <td className="w-1/2 py-2 pl-1 pr-2 align-top leading-[23px]">
                                                <ReadMore value={item.value} />
                                              </td>
                                            </>
                                          )}
                                        {item.type === 'detail' &&
                                          !item.title && (
                                            <td
                                              colSpan={2}
                                              className="px-4 py-2 leading-[23px]"
                                            >
                                              <ReadMore value={item.value} />
                                            </td>
                                          )}
                                        {item.type === 'read-more' && (
                                          <td
                                            colSpan={2}
                                            className="px-4 py-4 italic leading-[23px]"
                                          >
                                            <ReadMore
                                              value={item.value}
                                              type={'comment'}
                                            />
                                          </td>
                                        )}
                                      </tr>
                                    )
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        );
                      })}
                    </div>
                  </ExpandableSection>
                </div>
              );
            })}
          </div>
        </div>
      </ExpandableSection>
    </div>
  );
};

export default AccountExpandedView;
