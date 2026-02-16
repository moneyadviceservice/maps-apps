import { v4 } from 'uuid';

import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Container } from '@maps-react/core/components/Container';

import { geoRegions } from '../../../../data/form-data/geo_regions';
import { Organisation } from '../../../../types/Organisations';
import { CheckboxGroup } from '../../../formInputs/CheckboxGroup';

type Props = {
  data: Organisation;
  isEditMode?: boolean;
};

export const CoverageAreas = ({ data, isEditMode }: Props) => {
  return (
    <Container className="overflow-hidden border rounded-md t-refine-search border-slate-300 mb-8 p-0">
      <div className=" w-full px-6 py-3 bg-slate-200 lg:grid lg:grid-cols-2 border-b border-slate-300">
        Coverage areas
      </div>

      {isEditMode ? (
        <CheckboxGroup
          defaultValues={data.geo_regions ?? []}
          options={geoRegions ?? []}
          classNames="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-6"
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-6">
          {data.geo_regions?.length ? (
            data.geo_regions?.map((region) => (
              <div
                key={v4()}
                className="flex items-center space-x-2"
                data-testid="coverage-item"
              >
                <Icon type={IconType.TICK_GREEN} className="w-4" />
                <span className="font-bold">{region.title}</span>
              </div>
            ))
          ) : (
            <span data-testid="coverage-na" className="font-bold">
              N/A
            </span>
          )}
        </div>
      )}
    </Container>
  );
};
