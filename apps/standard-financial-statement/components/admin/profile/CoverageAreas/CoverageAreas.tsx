import { H2 } from 'components/Heading/Heading';
import { v4 } from 'uuid';

import { Icon, IconType } from '@maps-react/common/components/Icon';

import { geoRegions } from '../../../../data/form-data/geo_regions';
import { Organisation } from '../../../../types/Organisations';
import { CheckboxGroup } from '../../../formInputs/CheckboxGroup';

type Props = {
  data: Organisation;
  isEditMode?: boolean;
};

export const CoverageAreas = ({ data, isEditMode }: Props) => {
  const label = 'Coverage areas';
  const RegionsListElement = data.geo_regions?.length ? 'ul' : 'div';

  return (
    <section className="container-auto overflow-hidden border rounded-md t-refine-search border-slate-300 mb-8 p-0">
      <H2>{label}</H2>

      {isEditMode ? (
        <CheckboxGroup
          defaultValues={data.geo_regions ?? []}
          options={geoRegions ?? []}
          legend={label}
          classNames="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-6"
        />
      ) : (
        <RegionsListElement className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-6">
          {data.geo_regions?.length ? (
            data.geo_regions?.map((region) => (
              <li
                key={v4()}
                className="flex items-center space-x-2"
                data-testid="coverage-item"
              >
                <Icon type={IconType.TICK_GREEN} className="w-4" />
                <span className="font-bold">{region.title}</span>
              </li>
            ))
          ) : (
            <span data-testid="coverage-na" className="font-bold">
              N/A
            </span>
          )}
        </RegionsListElement>
      )}
    </section>
  );
};
