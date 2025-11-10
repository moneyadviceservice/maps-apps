import { v4 } from 'uuid';

import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Paragraph } from '@maps-react/common/components/Paragraph';

import { deliveryChannel } from '../../../../data/form-data/delivery_channel';
import { Organisation } from '../../../../types/Organisations';
import { CheckboxGroup } from '../../../formInputs/CheckboxGroup';
import { IntendedUseSelect } from '../../../formInputs/IntendedUseSelect';

type Props = {
  data: Organisation;
  isEditMode?: boolean;
};

const headingClasses = 'text-gray-450 mb-0';

export const Usage = ({ data, isEditMode }: Props) => {
  const intendedUse =
    data.usage?.intended_use === 'other'
      ? data.usage?.other_use
      : data.usage?.intended_use;

  return (
    <div className="w-full">
      <div className=" w-full px-6 py-3 bg-slate-200 lg:grid lg:grid-cols-2 border-b border-slate-300 rounded-t-md p-0">
        SFS Usage
      </div>

      <div className="p-6">
        <div className="mb-6">
          <Paragraph className={headingClasses}>Intended use of SFS</Paragraph>
          {isEditMode ? (
            <IntendedUseSelect
              defaultVal={data.usage?.intended_use ?? ''}
              lang="en"
              isEditOrg={true}
            />
          ) : (
            <Paragraph data-testid="usage-intended" className="font-bold">
              {intendedUse ?? 'N/A'}
            </Paragraph>
          )}
        </div>

        <div className="mb-6">
          <Paragraph className={headingClasses}>
            How do you deliver debt advice?
          </Paragraph>
          {isEditMode ? (
            <CheckboxGroup
              options={deliveryChannel}
              defaultValues={data.delivery_channel ?? []}
              legend="How do you deliver debt advice?"
            />
          ) : (
            <Paragraph
              data-testid="usage-delivery-channel"
              className="font-bold flex"
            >
              {data.delivery_channel?.length
                ? data.delivery_channel.map((channel) => (
                    <span key={v4()} className="mb-0 mr-4">
                      <Icon type={IconType.TICK_GREEN} className="w-4 inline" />
                      <span className="ml-2">{channel.title}</span>
                    </span>
                  ))
                : 'N/A'}
            </Paragraph>
          )}
        </div>

        <div className="mb-6">
          <Paragraph className={headingClasses}>
            {`SFS Launch date (or estimated${
              isEditMode ? ')' : ' launch date)'
            }`}
          </Paragraph>
          {isEditMode ? (
            <>
              <input
                name="launch_date"
                defaultValue={data.usage?.launch_date ?? ''}
                className={
                  'w-full max-w-[458px] border border-slate-400 rounded px-2 py-1 h-[49px]'
                }
              />
              <Paragraph className="text-sm text-gray-400">
                Add date in 01/01/2025 format
              </Paragraph>
            </>
          ) : (
            <Paragraph data-testid="usage-launch-date" className="font-bold">
              {data.usage?.launch_date ?? 'N/A'}
            </Paragraph>
          )}
        </div>

        <div className="mb-6">
          <Paragraph className={headingClasses}>
            Case management software used
          </Paragraph>
          {isEditMode ? (
            <input
              name="management_software_used"
              defaultValue={data.usage?.management_software_used ?? ''}
              className={
                'w-full max-w-[458px] border border-slate-400 rounded px-2 py-1 h-[49px]'
              }
            />
          ) : (
            <Paragraph data-testid="usage-software" className="font-bold">
              {data.usage?.management_software_used ?? 'N/A'}
            </Paragraph>
          )}
        </div>
      </div>
    </div>
  );
};
