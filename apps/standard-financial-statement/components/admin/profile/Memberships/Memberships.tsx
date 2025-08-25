import { v4 } from 'uuid';

import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Paragraph } from '@maps-react/common/components/Paragraph';

import { Organisation } from '../../../../types/Organisations';
import { RadioSelect } from '../../../formInputs/RadioSelect';

type Props = {
  data: Organisation;
  isEditMode?: boolean;
};

const inputClasses =
  'w-full max-w-[458px] border border-slate-400 rounded px-2 py-1 h-[49px] font-normal';

export const Memberships = ({ data, isEditMode }: Props) => {
  return (
    <div className="w-full overflow-hidden">
      <div className="w-full px-6 py-3 bg-slate-200 lg:grid lg:grid-cols-2 border-b border-slate-300 rounded-t-md p-0">
        Memberships
      </div>

      <div className="p-6 overflow-x-auto ">
        <div className="min-w-[550px]">
          <div className="flex flex-col lg:flex-row mb-6">
            <div className="w-full md:w-1/2">
              <Paragraph className="text-gray-450 mb-0">
                Registered with FCA
              </Paragraph>

              {isEditMode ? (
                <RadioSelect
                  legend="Registered with FCA"
                  fieldName="fca_registered"
                  options={[
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' },
                  ]}
                  defaultValue={data.fca?.fca_number ? 'yes' : 'no'}
                />
              ) : (
                <Paragraph data-testid="fca-registered" className="font-bold">
                  {data.fca?.fca_number ? (
                    <>
                      <Icon type={IconType.TICK_GREEN} className="w-4 inline" />{' '}
                      Yes
                    </>
                  ) : (
                    <>
                      <Icon
                        type={IconType.CLOSE_RED}
                        className="w-4 inline"
                        viewBox="0 0 25 25"
                      />{' '}
                      No
                    </>
                  )}
                </Paragraph>
              )}
            </div>
            <div className="w-full md:w-1/2">
              <Paragraph className="text-gray-450 mb-0">
                FCA licence number
              </Paragraph>
              {isEditMode ? (
                <input
                  name="fca_number"
                  defaultValue={data.fca?.fca_number ?? ''}
                  className={inputClasses}
                />
              ) : (
                <Paragraph data-testid="fca-number" className="font-bold">
                  {data.fca && data.fca.fca_number !== ''
                    ? data.fca.fca_number
                    : 'N/A'}
                </Paragraph>
              )}
            </div>
          </div>

          <div className="flex">
            <div className="flex flex-col w-full">
              <div className="flex">
                <div className="w-1/2">
                  <Paragraph className="text-gray-450 mb-0">
                    Organisation Membership
                  </Paragraph>
                </div>
                <div className="w-1/2">
                  <Paragraph className="text-gray-450 mb-0">
                    Membership number
                  </Paragraph>
                </div>
              </div>

              {data.organisation_membership?.map((membership, idx) => (
                <div className="flex" key={v4()} data-testid="membership-item">
                  <div className="w-1/2 font-bold">
                    {isEditMode ? (
                      <input
                        name={`organisation_membership[${membership.key}].title`}
                        defaultValue={membership.title}
                        className={inputClasses}
                      />
                    ) : (
                      <Paragraph>{membership.title}</Paragraph>
                    )}
                  </div>
                  <div className="w-1/2 font-bold">
                    {isEditMode ? (
                      <input
                        name={`organisation_membership[${idx}].key`}
                        defaultValue={membership.key}
                        className={inputClasses}
                      />
                    ) : (
                      <Paragraph>{membership.key}</Paragraph>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
