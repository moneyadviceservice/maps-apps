import { ChangeEvent } from 'react';

import { Icon, IconType } from '@maps-react/common/components/Icon';
import useTranslation from '@maps-react/hooks/useTranslation';

type Props = {
  onChangeHandler: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
};

export const SearchOrgInput = ({ onChangeHandler, value }: Props) => {
  const { z } = useTranslation();

  return (
    <>
      <label htmlFor="name" className="block mb-2">
        {z({ en: 'Search organisations', cy: 'Chwilio sefydliadau ' })}
      </label>
      <div className="flex max-w-[458px]">
        <input
          id="name"
          name="name"
          className="w-full p-2 border border-gray-400 border-r-0 rounded-l "
          placeholder={z({
            en: 'Search by name or membership code',
            cy: 'Chwilio yn ôl enw neu god aelodaeth',
          })}
          value={value}
          onChange={(e) => onChangeHandler(e)}
        />
        <button
          type="submit"
          className="p-2 bg-green-300 rounded-r"
          title="Search name"
        >
          <Icon type={IconType.SEARCH_ICON} />
        </button>
      </div>
    </>
  );
};
