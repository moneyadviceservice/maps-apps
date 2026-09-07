import { H2 } from 'components/Heading/Heading';
import { twMerge } from 'tailwind-merge';

import { Link } from '@maps-react/common/components/Link';

import { Organisation } from '../../../../types/Organisations';
import { SelectOrgType } from '../../../Organisations/SelectOrgType';

type Props = {
  data: Organisation;
  isEditMode?: boolean;
};

const inputClasses = 'w-full border border-gray-650 rounded px-2 py-1 h-[49px]';

export const OrganisationDetails = ({ data, isEditMode }: Props) => {
  return (
    <section className="container-auto overflow-hidden border rounded-md mb-8 p-0">
      <H2>Organisation details</H2>

      <div className={'p-6 overflow-scroll'}>
        <dl className="w-full grid grid-cols-[repeat(4,minmax(min-content,1fr))]">
          <dt
            id="organisation-name-label"
            className="t-title font-normal leading-[23px] col-start-1 row-start-1 min-w-0 border-slate-300 border-r-2"
          >
            Organisation name
          </dt>
          <dd
            data-testid="org-name"
            className={twMerge(
              't-value text-[19px] leading-[25px] pt-2 pr-6 col-start-1 row-start-2 min-w-0 border-slate-300 border-r-2',
              !isEditMode && ' font-semibold',
            )}
          >
            {isEditMode ? (
              <input
                name="name"
                defaultValue={data.name}
                aria-labelledby={'organisation-name-label'}
                className={inputClasses}
              />
            ) : (
              data.name
            )}
          </dd>
          <dt
            id="organisation-type-label"
            className="t-title font-normal leading-[23px] px-6 col-start-2 row-start-1 min-w-0 border-slate-300 border-r-2"
          >
            Organisation type
          </dt>
          <dd
            data-testid="org-type"
            className={twMerge(
              't-value text-[19px] leading-[25px] pt-2 px-6 col-start-2 row-start-2 min-w-0 border-slate-300 border-r-2',
              !isEditMode && ' font-semibold',
            )}
          >
            {isEditMode ? (
              <SelectOrgType
                defaultVal={data.type.title}
                lang="en"
                ariaLabelledBy={'organisation-type-label'}
                isEditOrg={true}
              />
            ) : (
              data.type.title
            )}
          </dd>
          <dt
            id="organisation-website-label"
            className={twMerge(
              't-title font-normal leading-[23px] px-6 col-start-3 row-start-1 min-w-0',
              !isEditMode && 'border-slate-300 border-r-2',
            )}
          >
            {isEditMode ? 'Website Address' : 'Organisation website'}
          </dt>
          <dd
            data-testid="org-website"
            className={twMerge(
              't-value text-[19px] leading-[25px] pt-2 px-6 col-start-3 row-start-2 min-w-0',
              !isEditMode && 'font-semibold border-slate-300 border-r-2',
            )}
          >
            {isEditMode ? (
              <input
                name="website"
                defaultValue={data.website ?? ''}
                aria-labelledby={'organisation-website-label'}
                className={inputClasses}
              />
            ) : (
              <Link href={data.website ?? 'www.example.com'}>
                {data.website ?? 'www.example.com'}
              </Link>
            )}
          </dd>
          {!isEditMode && (
            <>
              <dt className="t-title font-normal leading-[23px] px-6 col-start-4 row-start-1 min-w-0">
                Organisation address
              </dt>
              <dd
                className="t-value text-[19px] leading-[25px] pt-2 px-6 col-start-4 row-start-2  font-semibold"
                data-testid="org-address"
              >
                {data.address ?? '123 Example Street, New City, Postcode'}
              </dd>
            </>
          )}
        </dl>

        {isEditMode && (
          <div className="mt-6">
            <label
              className="block pb-2"
              htmlFor="organisation-address-input"
              data-testid="street-address"
            >
              Organisation street address
            </label>
            <input
              data-testid="street-address-input"
              id="organisation-address-input"
              defaultValue={data.address ?? ''}
              className={inputClasses}
            />
          </div>
        )}
      </div>
    </section>
  );
};
