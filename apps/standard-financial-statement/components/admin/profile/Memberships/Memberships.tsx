import { H2 } from 'components/Heading/Heading';
import { twMerge } from 'tailwind-merge';
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
  'w-full max-w-[458px] border border-gray-650 rounded px-2 py-1 h-[49px] font-normal';

export const Memberships = ({ data, isEditMode }: Props) => {
  return (
    <>
      <H2>Memberships</H2>
      <dl className="grid grid-cols-2 justify-between p-6">
        <dt className="text-gray-450 mb-0 col-start-1 row-start-1 col-span-2 lg:col-span-1">
          Registered with FCA
        </dt>
        <dd
          className="col-start-1 row-start-2 flex items-start col-span-2 lg:col-span-1"
          data-testid={isEditMode ? undefined : 'fca-registered'}
        >
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
            <>
              {data.fca?.fca_number ? (
                <>
                  <Icon
                    type={IconType.TICK_GREEN}
                    className="w-4 inline mt-2 mr-2"
                  />{' '}
                  <Paragraph className="font-bold">Yes</Paragraph>
                </>
              ) : (
                <>
                  <Icon
                    type={IconType.CLOSE_RED}
                    className="w-4 inline"
                    viewBox="0 0 25 25"
                  />{' '}
                  <Paragraph className="font-bold">No</Paragraph>
                </>
              )}
            </>
          )}
        </dd>
        <dt
          className="text-gray-450 mb-0 col-start-1 row-start-3 col-span-2 lg:col-start-2 lg:row-start-1 lg:col-span-1"
          id={'fca-licence-number-label'}
        >
          FCA licence number
        </dt>
        <dd className="col-start-1 row-start-4 col-span-2 lg:col-start-2 lg:row-start-2 lg:col-span-1">
          {isEditMode ? (
            <input
              name="fca_number"
              data-testid="fca-number-input"
              aria-describedby="fca-licence-number-label"
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
        </dd>
      </dl>
      <div className="m-6">
        <table className="w-full">
          <thead>
            <tr>
              <th
                className="font-normal text-left text-gray-450 mb-0 col-start-1 row-start-5 lg:col-start-1 lg:row-start-3"
                id={'organisation-membership-label'}
              >
                Organisation Membership
              </th>
              <th
                className="font-normal text-left text-gray-450 mb-0 col-start-2 row-start-5 lg:row-start-3"
                id={'membership-number-label'}
              >
                Membership number
              </th>
            </tr>
          </thead>
          <tbody>
            {data.organisation_membership?.map((membership, idx) => (
              <tr key={v4()} data-testid="membership-item">
                <td className={isEditMode ? undefined : 'font-bold'}>
                  {isEditMode ? (
                    <input
                      data-testid={`organisation-membership[${membership.key}].title`}
                      name={`organisation_membership[${membership.key}].title`}
                      aria-describedby="organisation-membership-label"
                      defaultValue={membership.title}
                      className={twMerge(
                        inputClasses,
                        idx < (data.organisation_membership?.length || 0) - 1
                          ? 'mb-2'
                          : '',
                      )}
                    />
                  ) : (
                    <>{membership.title}</>
                  )}
                </td>
                <td className={isEditMode ? undefined : 'font-bold'}>
                  {isEditMode ? (
                    <input
                      data-testid={`organisation-membership[${idx}].key`}
                      name={`organisation_membership[${idx}].key`}
                      aria-describedby="membership-number-label"
                      defaultValue={membership.key}
                      className={twMerge(
                        inputClasses,
                        idx < (data.organisation_membership?.length || 0) - 1
                          ? 'mb-2'
                          : '',
                      )}
                    />
                  ) : (
                    <>{membership.key}</>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
