import { twMerge } from 'tailwind-merge';

import { ListElement } from '@maps-react/common/components/ListElement';
import { Markdown } from '@maps-react/vendor/components/Markdown';

type ListProps = {
  items: string[];
  variant?: 'unordered' | 'ordered';
  start?: number;
  className?: string;
};

export const List = ({
  items,
  variant = 'unordered',
  start,
  className,
}: ListProps) => {
  if (items.length === 0) return null;

  return (
    <ListElement
      items={items.map((item, index) => (
        <Markdown key={index} content={item} disableParagraphs />
      ))}
      variant={variant}
      color="blue"
      start={start}
      className={twMerge(
        'mb-6 ml-10 space-y-4 marker:font-bold',
        variant === 'unordered' &&
          'marker:text-2xl marker:leading-[1] [&_li>span]:top-[-3px] [&_li>span]:relative',
        className,
      )}
    />
  );
};
