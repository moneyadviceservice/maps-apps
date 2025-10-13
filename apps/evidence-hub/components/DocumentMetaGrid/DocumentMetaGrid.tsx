import { twMerge } from 'tailwind-merge';
import { DocumentTemplate } from 'types/@adobe/page';

import { ListElement } from '@maps-react/common/index';

type Props = {
  doc: DocumentTemplate;
};

export const DocumentMetaGrid = ({ doc }: Props) => {
  const columns: { title: string; items: string[] }[] = [
    {
      title: 'Evidence type',
      items: [
        ...(doc.pageType ? [doc.pageType.name || doc.pageType.key] : []),
        ...(doc.dataType && doc.dataType.length > 0
          ? doc.dataType.map((tag) => tag.name || tag.key)
          : []),
      ],
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
        <div key={col.title} className={'sm:px-2 pt-2 pb-7'}>
          <p className="mb-2 font-semibold">{col.title}</p>
          <div className="pl-2">
            <ListElement
              items={col.items}
              color="blue"
              variant="unordered"
              className="pl-4"
            />
          </div>
        </div>
      ))}
    </div>
  );
};
