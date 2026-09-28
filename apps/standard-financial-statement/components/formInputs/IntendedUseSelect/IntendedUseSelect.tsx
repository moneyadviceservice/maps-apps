import { twMerge } from 'tailwind-merge';

import { Icon, IconType } from '@maps-react/common/components/Icon';
import useTranslation from '@maps-react/hooks/useTranslation';

import { intendedUse } from '../../../data/form-data/intended_use';

type Props = {
  defaultVal: string;
  lang: string;
  isEditOrg?: boolean;
  ariaLabelledBy?: string;
};

export const IntendedUseSelect = ({
  defaultVal,
  lang,
  isEditOrg,
  ariaLabelledBy,
}: Props) => {
  const { z } = useTranslation();

  return (
    <>
      {!isEditOrg && (
        <label htmlFor="intended_use" className="block mb-2">
          {z({
            en: 'Filter by organisation type',
            cy: 'Hidlo yn ôl math o sefydliad',
          })}
        </label>
      )}
      <div className="relative h-[49px] max-w-[458px]">
        <select
          data-testid="select-input"
          id="intended_use"
          name="intended_use"
          className="w-full h-full p-2 border border-gray-650 rounded"
          defaultValue={defaultVal}
          aria-labelledby={ariaLabelledBy}
        >
          <option value="">
            {z({
              en: 'Please select a value',
              cy: 'Dewiswch',
            })}
          </option>
          {intendedUse.map((use) => (
            <option key={use.value} value={use.value}>
              {use[lang as 'en' | 'cy']}
            </option>
          ))}
        </select>
        <Icon
          type={IconType.CHEVRON_DOWN}
          className={twMerge(
            'absolute right-0 top-0 pointer-events-none w-12 p-3 h-full rounded-r',
            isEditOrg ? 'bg-magenta-800 text-white' : 'bg-green-300',
          )}
        />
      </div>
    </>
  );
};
