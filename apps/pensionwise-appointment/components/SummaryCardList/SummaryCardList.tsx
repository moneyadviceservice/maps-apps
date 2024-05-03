import {
  mapJsonRichText,
  InformationCallout,
  H4,
} from '@maps-digital/shared/ui';
import { ToDoCard } from '../../utils';
import { useTranslation } from '@maps-digital/shared/hooks';

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
            className="p-0 pb-6 md:p-0 m-0 md:flex"
            data-testid={`summary-card-${i}`}
          >
            <InformationCallout className="w-full md:flex md:flex-col md:justify-between px-4 md:px-7 py-6">
              <div>
                <H4 className="text-xl mb-4" data-testid="summary-card-title">
                  {item.title}
                </H4>
                {mapJsonRichText(item.text.json)}
              </div>
              <p
                className="text-right text-sm"
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
