import { twMerge } from 'tailwind-merge';
import { DocumentTemplate } from 'types/@adobe/page';

import { ListElement } from '@maps-react/common/index';

type Props = {
  doc: DocumentTemplate;
};

export const DocumentMetaGrid = ({ doc }: Props) => {
  const hasSubItems = doc.dataTypes && doc.dataTypes.length > 0;
  const columns: { title: string; items: string[]; subItems?: string[] }[] = [
    {
      title: 'Evidence type',
      items: [
        ...(doc.pageType
          ? [
              `${doc.pageType.name}${hasSubItems ? ':' : ''}` ||
                doc.pageType.key,
            ]
          : []),
      ],
      subItems: hasSubItems
        ? doc.dataTypes?.map((tag) => tag.name || tag.key)
        : [],
    },
    {
      title: 'Topics',
      items: doc.topic ? doc.topic.map((tag) => tag.name || tag.key) : [],
    },
    {
      title: 'Country',
      items: doc.countryOfDelivery
        ? doc.countryOfDelivery.map((tag) => tag.name || tag.key)
        : [],
    },
    {
      title: 'Population Group',
      items: doc.clientGroup
        ? doc.clientGroup.map((tag) => tag.name || tag.key)
        : [],
    },
  ];

  const visibleColumns = columns.filter((col) => col.items.length > 0);
  const colCount = visibleColumns.length || 1;

  const gridColsClass: Record<number, string> = {
    1: 'sm:grid-cols-1',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3',
    4: 'sm:grid-cols-4',
    5: 'sm:grid-cols-5',
  };

  return (
    <div
      className={twMerge(
        'grid-cols-1',
        gridColsClass[colCount],
        `grid text-sm text-gray-700 py-2 divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-gray-200`,
      )}
    >
      {visibleColumns.map((col) => (
        <div key={col.title} className={'sm:pl-2.5 sm:pr-4 pt-2 pb-7'}>
          <p className="mb-4 font-semibold text-[18px]">{col.title}</p>
          <div className="pl-2">
            <ListElement
              items={col.items}
              color="blue"
              variant="unordered"
              className="pl-4 text-[18px] mb-0"
            />
            {col.subItems && (
              <ListElement
                items={col.subItems}
                color="none"
                variant="none"
                className={twMerge('pl-5', 'list-none space-y-1 mt-1')}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
