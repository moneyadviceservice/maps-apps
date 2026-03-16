import { H2, H3 } from '@maps-react/common/index';
import useTranslation from '@maps-react/hooks/useTranslation';

import { whatToDo } from '../../../data/form-content/text/results';

type WhatToDoProps = {
  showAdditionalItem: boolean;
};

export const WhatToDo = ({ showAdditionalItem }: WhatToDoProps) => {
  const { z } = useTranslation();
  const { heading, items } = whatToDo(z);

  const displayItems = !showAdditionalItem ? items.slice(1) : items.slice();

  return (
    <>
      <H2 className="mb-8 text-blue-700 md:text-5xl">{heading}</H2>
      {displayItems.map((item, index) => {
        return (
          <div key={`whatToDo-${index}`} className={index > 0 ? 'mt-8' : ''}>
            <H3 className="pl-2 font-semibold md:text-4xl">
              {index + 1}. {item.heading}
            </H3>
            <p className="mt-4 font-medium">{item.content}</p>
          </div>
        );
      })}
    </>
  );
};
