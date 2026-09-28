import { H4 } from '@maps-react/common/components/Heading';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { mapJsonRichText } from '@maps-react/vendor/utils/RenderRichText';

import { ToDoCard } from '../../utils';

export type SummaryCardListProps = {
  data: ToDoCard[];
  testId?: string;
};

export const SummaryCardList = ({
  data,
  testId = 'summary-card-list',
}: SummaryCardListProps) => {
  const { z } = useTranslation();

  return (
    <ul
      data-testid={testId}
      className="m-0 md:grid md:grid-cols-2 md:gap-6 xl:gap-y-10 md:auto-rows-fr"
    >
      {data.map((item, i) => {
        return (
          <li
            key={i}
            className="p-0 pb-6 m-0 md:p-0 md:flex"
            data-testid={`summary-card-${i}`}
          >
            <InformationCallout className="w-full px-4 py-6 md:flex md:flex-col md:justify-between md:px-7">
              <div>
                <H4 className="mb-4 text-xl" data-testid="summary-card-title">
                  {item.title}
                </H4>
                {mapJsonRichText(item.text.json)}
              </div>
              <p
                className="text-sm text-right"
                data-testid="summary-card-duration"
              >
                (
                {z({
                  en: 'approximately',
                  cy: 'tua',
                })}{' '}
                <span className="font-bold">
                  {item.duration}{' '}
                  {z({
                    en: 'minutes',
                    cy: 'munud',
                  })}
                  )
                </span>
              </p>
            </InformationCallout>
          </li>
        );
      })}
    </ul>
  );
};
