import { H2 } from 'components/Heading/Heading';
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
    <>
      <H2>SFS Usage</H2>

      <dl className="p-6">
        <dt id="intended-use-of-sfs-label" className={headingClasses}>
          Intended use of SFS
        </dt>
        <dd className="mb-6">
          {isEditMode ? (
            <IntendedUseSelect
              defaultVal={data.usage?.intended_use ?? ''}
              lang="en"
              isEditOrg={true}
              ariaLabelledBy={'intended-use-of-sfs-label'}
            />
          ) : (
            <Paragraph data-testid="usage-intended" className="font-bold">
              {intendedUse ?? 'N/A'}
            </Paragraph>
          )}
        </dd>

        <dt className={headingClasses}>How do you deliver debt advice?</dt>
        <dd className="mb-6">
          {isEditMode ? (
            <CheckboxGroup
              options={deliveryChannel}
              defaultValues={data.delivery_channel ?? []}
              legend="How do you deliver debt advice?"
            />
          ) : (
            <ul
              data-testid="usage-delivery-channel"
              className="font-bold flex flex-col lg:flex-row"
            >
              {data.delivery_channel?.length
                ? data.delivery_channel.map((channel) => (
                    <li key={v4()} className="flex items-start mb-0 mr-4">
                      <Icon
                        type={IconType.TICK_GREEN}
                        className="w-4 inline mt-2 min-w-4"
                      />
                      <span className="ml-2">{channel.title}</span>
                    </li>
                  ))
                : 'N/A'}
            </ul>
          )}
        </dd>

        <dt id={'sfs-launch-date-label'} className={headingClasses}>
          {`SFS Launch date (or estimated${isEditMode ? ')' : ' launch date)'}`}
        </dt>
        <dd className="mb-6">
          {isEditMode ? (
            <>
              <input
                name="launch_date"
                aria-labelledby={'sfs-launch-date-label'}
                aria-describedby={'sfs-launch-date-hint'}
                defaultValue={data.usage?.launch_date ?? ''}
                className="w-full max-w-[458px] border border-gray-650 rounded px-2 py-1 h-[49px]"
              />
              <Paragraph
                id={'sfs-launch-date-hint'}
                className="text-sm text-gray-400"
              >
                Add date in 01/01/2025 format
              </Paragraph>
            </>
          ) : (
            <Paragraph data-testid="usage-launch-date" className="font-bold">
              {data.usage?.launch_date ?? 'N/A'}
            </Paragraph>
          )}
        </dd>

        <dt
          id={'sfs-case-management-software-used-label'}
          className={headingClasses}
        >
          Case management software used
        </dt>
        <dd className="mb-6">
          {isEditMode ? (
            <input
              name="management_software_used"
              aria-describedby={'sfs-case-management-software-used-label'}
              defaultValue={data.usage?.management_software_used ?? ''}
              className={
                'w-full max-w-[458px] border border-gray-650 rounded px-2 py-1 h-[49px]'
              }
            />
          ) : (
            <Paragraph data-testid="usage-software" className="font-bold">
              {data.usage?.management_software_used ?? 'N/A'}
            </Paragraph>
          )}
        </dd>
      </dl>
    </>
  );
};
