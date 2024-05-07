import {
  mapJsonRichText,
  InformationCallout,
  H4,
  Icon,
  IconType,
} from '@maps-digital/shared/ui';
import { ToDoItem } from '../../utils';

export type SummaryListProps = {
  items: ToDoItem[];
  title: string;
  testId?: string;
};

export const SummaryList = ({
  items,
  title,
  testId = 'summary-list',
}: SummaryListProps) => {
  return (
    <div data-testid={testId} className="mb-10">
      <InformationCallout>
        <div className="p-4 md:p-8 pb-4">
          <div className="flex align-middle items-center mb-4">
            <span className="flex justify-center items-center shrink-0 bg-pink-600 text-white rounded-full w-[50px] h-[50px]">
              <Icon type={IconType.CHECKLIST} />
            </span>
            <H4
              className="text-[22px] mb-0 ml-4"
              data-testid="summary-list-title"
            >
              {title}
            </H4>
          </div>
          <ul className="pl-2">
            {items.map((item, i) => {
              return (
                <li
                  key={i}
                  className="list-disc ml-4"
                  data-testid={`summary-list-item-${i}`}
                >
                  {mapJsonRichText(item.text.json)}
                </li>
              );
            })}
          </ul>
        </div>
      </InformationCallout>
    </div>
  );
};
