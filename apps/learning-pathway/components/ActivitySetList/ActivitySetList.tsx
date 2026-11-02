import { ActivitySet } from 'lib/types/site.type';

import { RichTextAem } from '@maps-react/vendor/components/RichTextAem';
import { mapJsonRichText } from '@maps-react/vendor/utils/RenderRichText/RenderRichText';

export interface ActivitySetListProps {
  items: ActivitySet[];
  keyHeading: string;
  valueHeading: string;
  testId?: string;
}

export const ActivitySetList = ({
  items,
  keyHeading,
  valueHeading,
  testId = 'activity-set-list',
}: ActivitySetListProps) => {
  return (
    <div data-testid={testId}>
      <div
        aria-hidden="true"
        className="hidden md:grid md:grid-cols-[220px_1fr] gap-8 py-3 border-b border-gray-300 font-bold text-gray-800"
      >
        <span>{keyHeading}</span>
        <span>{valueHeading}</span>
      </div>
      <dl className="m-0">
        {items.map((item) => (
          <div
            key={item.title}
            data-testid={`${testId}-row`}
            className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-1 md:gap-8 py-4 border-b border-gray-300"
          >
            <dt className="font-bold text-gray-800">{item.title}</dt>
            <dd className="m-0 text-gray-800">
              <RichTextAem>
                {mapJsonRichText(item.description.json)}
              </RichTextAem>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};
