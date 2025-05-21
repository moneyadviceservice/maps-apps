import { ChangeEvent } from 'react';

import { twMerge } from 'tailwind-merge';

import { Icon, IconType } from '@maps-react/common/components/Icon';
import useTranslation from '@maps-react/hooks/useTranslation';

import { organisationTypes } from '../../../data/form-data/organisation_types';

type Props = {
  onClickHandler?: (e: ChangeEvent<HTMLSelectElement>) => void;
  defaultVal: string;
  lang: string;
  isEditOrg?: boolean;
};

export const SelectOrgType = ({
  onClickHandler,
  defaultVal,
  lang,
  isEditOrg,
}: Props) => {
  const { z } = useTranslation();

  return (
    <>
      {!isEditOrg && (
        <label htmlFor="type" className="block mb-2">
          {z({
            en: 'Filter by organisation type',
            cy: 'Hidlo yn ôl math o sefydliad',
          })}
        </label>
      )}
      <div className="relative h-[49px] max-w-[458px]">
        <select
          id="type"
          name="type"
          className="w-full h-full p-2 border border-gray-400 rounded"
          defaultValue={defaultVal}
          onChange={(e) => onClickHandler && onClickHandler(e)}
        >
          <option value="">
            {z({
              en: 'Please select a value',
              cy: 'Dewiswch',
            })}
          </option>
          {organisationTypes.map((org) => (
            <option key={org.value} value={org.value}>
              {org[lang as 'en' | 'cy']}
            </option>
          ))}
        </select>
        <Icon
          type={IconType.CHEVRON_DOWN}
          className={twMerge(
            'absolute right-0 top-0 pointer-events-none w-12 p-3 h-full rounded-r',
            isEditOrg ? 'bg-pink-600 text-white' : 'bg-green-300',
          )}
        />
      </div>
    </>
  );
};
