import { twMerge } from 'tailwind-merge';

import { Link } from '@maps-react/common/components/Link';
import { Container } from '@maps-react/core/components/Container';

import { Organisation } from '../../../../types/Organisations';
import { SelectOrgType } from '../../../Organisations/SelectOrgType';

type Props = {
  data: Organisation;
  isEditMode?: boolean;
};

const inputClasses =
  'w-full border border-slate-400 rounded px-2 py-1 h-[49px]';

export const OrganisationDetails = ({ data, isEditMode }: Props) => {
  return (
    <Container className="overflow-hidden border rounded-md t-refine-search border-slate-300 mb-8 p-0">
      <div className="w-full px-6 py-3 bg-slate-200 lg:grid lg:grid-cols-2 border-b border-slate-300">
        Organisation details
      </div>

      <div className={'p-6 overflow-scroll'}>
        <table className="w-full border-collapse ">
          <thead>
            <tr className="divide-x-2 border-slate-300">
              <th
                className={`t-title w-1/4 px-6 pb-0 text-left font-normal leading-[23px] align-top first:pl-0`}
              >
                Organisation name
              </th>
              <th
                className={`t-title w-1/4 px-6 pb-0 text-left font-normal leading-[23px] align-top`}
              >
                Organisation type
              </th>
              <th
                className={`t-title w-1/4 px-6 pb-0 text-left font-normal leading-[23px] align-top`}
              >
                {isEditMode ? 'Website Address' : 'Organisation website'}
              </th>
              {!isEditMode && (
                <th
                  className={`t-title w-1/4 px-6 pb-0 text-left font-normal leading-[23px] align-top`}
                >
                  Organisation address
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            <tr
              className={twMerge(
                'divide-x-2 border-slate-400',
                !isEditMode && 'font-semibold',
              )}
            >
              <td
                data-testid="org-name"
                className={`t-value px-6 pt-2 text-[19px] w-1/4 leading-[25px] first:pl-0`}
              >
                {isEditMode ? (
                  <input
                    name="name"
                    defaultValue={data.name}
                    className={inputClasses}
                  />
                ) : (
                  data.name
                )}
              </td>
              <td
                data-testid="org-type"
                className={`t-value px-6 pt-2 text-[19px] w-1/4 leading-[25px]`}
              >
                {isEditMode ? (
                  <SelectOrgType
                    defaultVal={data.type.title}
                    lang="en"
                    isEditOrg={true}
                  />
                ) : (
                  data.type.title
                )}
              </td>
              <td
                data-testid="org-website"
                className={`t-value px-6 pt-2 text-[19px] w-1/4 leading-[25px]`}
              >
                {isEditMode ? (
                  <input
                    name="website"
                    defaultValue={data.website ?? ''}
                    className={inputClasses}
                  />
                ) : (
                  <Link href={data.website ?? 'www.example.com'}>
                    {data.website ?? 'www.example.com'}
                  </Link>
                )}
              </td>
              {!isEditMode && (
                <td
                  data-testid="org-address"
                  className={`t-value px-6 pt-2 text-[19px] w-1/4 leading-[25px]`}
                >
                  {data.address ?? '123 Example Street, New City, Postcode'}
                </td>
              )}
            </tr>
          </tbody>
        </table>
        {isEditMode && (
          <div className="mt-6">
            <label
              className="block pb-2"
              htmlFor="address"
              data-testid="street-address"
            >
              Organisation street address
            </label>
            <input
              data-testid="street-address-input"
              name="address"
              defaultValue={data.address ?? ''}
              className={inputClasses}
            />
          </div>
        )}
      </div>
    </Container>
  );
};
