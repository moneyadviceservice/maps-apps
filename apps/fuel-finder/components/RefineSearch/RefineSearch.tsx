import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { twMerge } from 'tailwind-merge';

import HyphenIcon from '@maps-react/common/assets/images/hyphen.svg';
import Plus from '@maps-react/common/assets/images/plus.svg';
import Spinner from '@maps-react/common/assets/images/spinner.svg';
import { Button } from '@maps-react/common/components/Button';
import { linkClasses } from '@maps-react/common/components/Link';
import { Checkbox } from '@maps-react/form/components/Checkbox';
import { RadioButton } from '@maps-react/form/components/RadioButton';
import { Select } from '@maps-react/form/components/Select';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { fuelTypeOptions, radiusOptions } from '../../data/fuel-finder';
import pageFilters from '../../utils/FuelFinder/filters/pageFilters';
import Label from '../Label';

const RefineSearch = () => {
  const [showRefineSearch, setShowRefineSearch] = useState(true);
  const [loading, setLoading] = useState(false);
  const { z } = useTranslation();

  const router = useRouter();
  const filters = pageFilters(router);

  useEffect(() => {
    setShowRefineSearch(false);
  }, []);

  return (
    <div className="overflow-hidden border rounded-md t-refine-search border-slate-400">
      <div className="hidden w-full px-6 py-5 text-gray-800 bg-gray-100 lg:flex lg:items-center lg:justify-between">
        <div
          className="text-left font-bold text-xl"
          data-testid="header-filters"
        >
          {z({ en: 'Filters', cy: 'Hidlwyr' })}
        </div>
        {filters.count > 0 && (
          <a
            href={filters.clearAllFiltersHref}
            className={linkClasses.join(' ')}
          >
            {z({ en: 'Clear all', cy: 'Clirio popeth' })}
          </a>
        )}
      </div>
      <button
        type="button"
        className="flex py-1.5 lg:hidden items-center justify-center w-full bg-gray-100 px-5 lg:px-6 lg:py-5 font-bold text-xl text-gray-900 gap-x-2.5 rounded-md"
        onClick={() => setShowRefineSearch((s) => !s)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setShowRefineSearch((s) => !s);
          }
        }}
        aria-expanded={showRefineSearch}
        tabIndex={0}
        data-testid="button-filters"
      >
        {showRefineSearch ? <HyphenIcon /> : <Plus />}
        <div>{z({ en: 'Filters', cy: 'Hidlwyr' })}</div>
      </button>

      <div
        className={twMerge(
          'p-6',
          showRefineSearch ? 'block' : 'hidden',
          'lg:block',
        )}
        id="refine-search"
        data-testid="refine-search"
      >
        {filters.postcode && (
          <input type="hidden" name="postcode" value={filters.postcode} />
        )}
        {router.query.lat && (
          <input type="hidden" name="lat" value={router.query.lat as string} />
        )}
        {router.query.lng && (
          <input type="hidden" name="lng" value={router.query.lng as string} />
        )}
        <div className="space-y-5">
          <div>
            <Label htmlFor="radius">
              {z({ en: 'Distance', cy: 'Pellter' })}
            </Label>
            <Select
              id="radius"
              name="radius"
              className="w-full"
              hideEmptyItem={true}
              defaultValue={filters.radius}
              options={radiusOptions(z).map((o) => ({
                text: o.text,
                value: o.value,
              }))}
            />
          </div>

          <fieldset className="space-y-4">
            <legend className="mb-3 text-lg font-bold text-gray-800">
              {z({ en: 'Fuel type', cy: 'Math o danwydd' })}
            </legend>
            {fuelTypeOptions(z).map((option) => (
              <RadioButton
                key={option.value}
                id={`fuelType-${option.value}`}
                name="fuelType"
                value={option.value}
                defaultChecked={filters.fuelType === option.value}
              >
                {option.title}
              </RadioButton>
            ))}
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-3 text-lg font-bold text-gray-800">
              {z({ en: 'Station amenities', cy: 'Nodweddion gorsaf' })}
            </legend>
            <div className="relative flex">
              <Checkbox
                id="motorway"
                name="motorway"
                value="true"
                defaultChecked={filters.motorway}
              >
                {z({
                  en: 'Motorway stations',
                  cy: 'Gorsafoedd traffordd',
                })}
              </Checkbox>
            </div>
            <div className="relative flex">
              <Checkbox
                id="supermarket"
                name="supermarket"
                value="true"
                defaultChecked={filters.supermarket}
              >
                {z({
                  en: 'Supermarket stations',
                  cy: 'Gorsafoedd archfarchnad',
                })}
              </Checkbox>
            </div>
            <div className="relative flex">
              <Checkbox
                id="open24h"
                name="open24h"
                value="true"
                defaultChecked={filters.open24h}
              >
                {z({ en: 'Open 24 hours', cy: 'Ar agor 24 awr' })}
              </Checkbox>
            </div>
            <div className="relative flex">
              <Checkbox
                id="toilets"
                name="toilets"
                value="true"
                defaultChecked={filters.toilets}
              >
                {z({ en: 'Toilets', cy: 'Toiledau' })}
              </Checkbox>
            </div>
          </fieldset>

          <Button
            variant={loading ? 'loading' : 'primary'}
            iconLeft={loading ? <Spinner className="animate-spin" /> : null}
            onClick={() => setLoading(true)}
            analyticsClassName={'tool-nav-submit tool-nav-complete'}
            className="w-full lg:w-auto"
            data-testid="apply-filters-button"
          >
            {z({ en: 'Apply filters', cy: 'Gosod hidlyddion' })}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RefineSearch;
