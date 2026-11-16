import { useState } from 'react';

import slug from 'slug';
import { twMerge } from 'tailwind-merge';

type Props = {
  options: { key: string; en: string; cy: string }[];
  defaultValues: {
    key: string;
    title: string;
  }[];
  legend?: string;
  classNames?: string;
};

export const CheckboxGroup = ({
  options,
  defaultValues,
  legend,
  classNames,
}: Props) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    defaultValues?.map((c) => c.key) || [],
  );

  return (
    <fieldset className="mt-3">
      {legend && <legend className="sr-only">{legend}</legend>}
      <div
        className={twMerge(
          classNames ?? 'grid space-y-4 sm:grid-cols-2 lg:block',
        )}
      >
        {options.map((item) => {
          const name = slug(item.key);
          const isSelected = selectedOptions.includes(item.key);

          return (
            <div key={item.key} className="relative flex items-center">
              <label
                htmlFor={name}
                className="relative flex items-center cursor-pointer w-full"
              >
                <input
                  type="checkbox"
                  id={name}
                  name={name}
                  checked={isSelected}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedOptions([...selectedOptions, item.key]);
                    } else {
                      setSelectedOptions(
                        selectedOptions.filter((v) => v !== item.key),
                      );
                    }
                  }}
                  className="peer absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 m-0"
                />

                <span
                  className={twMerge(
                    'w-8 h-8 min-w-8 max-w-8 min-h-8 max-h-8 flex items-center justify-center rounded-sm border-1 border-gray-650',
                    'peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-magenta-800',
                    isSelected && 'bg-magenta-800',
                  )}
                >
                  <svg
                    className={twMerge(
                      'w-8 h-8 text-white hidden',
                      isSelected && 'block',
                    )}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <span className="ml-3">{item.en}</span>
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
};
