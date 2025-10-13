import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { accountAccess, accountFeatures } from '../../data/compare-accounts';
import extractExpandedAccountDetails from '../../utils/CompareAccounts/extractExpandedAccountDetails';
import AccountCheckboxes from './AccountCheckboxes';
import { AccountProps } from './CompareAccounts';
import Detail from './Detail';
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
                            {section.title && (
                              <div className="px-4 mb-3 text-lg font-bold">
                                {section.title}
                              </div>
                            )}
                            <div>
                              {section.items.map((item, i) => {
                                return (
                                  item.value && (
                                    <div key={i}>
                                      {item.type === 'detail' && (
                                        <Detail
                                          title={item.title}
                                          value={item.value}
                                        />
                                      )}
                                      {item.type === 'read-more' &&
                                        item.value && (
                                          <div className="px-4 py-2 italic">
                                            <ReadMore
                                              value={item.value}
                                              type={'comment'}
                                            />
                                          </div>
                                        )}
                                    </div>
                                  )
                                );
                              })}
                            </div>
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
