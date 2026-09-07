import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

import { twMerge } from 'tailwind-merge';

import { Icon, IconType } from '../../components/Icon';

type Color = 'magenta' | 'dark' | 'blue' | 'teal' | 'pink' | 'red' | 'none';

type CommonProps = {
  className?: string;
  color: Color;
  start?: number;
  columns?: 1 | 2;
  nested?: boolean;
  dataTestId?: string;
};

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

type SublistProp = DistributiveOmit<ListElementProps, 'color'> & {
  color?: CommonProps['color'];
};

// Item can be a simple node or an object containing content + optional nested sublist props
export type ListItemElement =
  | ReactNode
  | {
      content: ReactNode;
      sublist?: SublistProp;
    };

type BaseProps = CommonProps & {
  items: ListItemElement[];
};

export type ListElementProps =
  | (DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement> &
      BaseProps & {
        variant: 'unordered' | 'arrow' | 'pros' | 'cons' | 'error';
      })
  | (DetailedHTMLProps<HTMLAttributes<HTMLOListElement>, HTMLOListElement> &
      BaseProps & {
        variant: 'ordered';
      })
  | (DetailedHTMLProps<HTMLAttributes<HTMLOListElement>, HTMLOListElement> &
      BaseProps & {
        variant: 'none';
      });

type ListItemProps = DetailedHTMLProps<
  HTMLAttributes<HTMLLIElement>,
  HTMLLIElement
> & {
  children: ReactNode | undefined;
  className?: string;
  variant?: 'pros' | 'cons';
};

const ListItem = ({
  className,
  children,
  variant,
  ...props
}: ListItemProps) => {
  const mergedClassName = twMerge(
    (variant === 'pros' || variant === 'cons') &&
      'flex items-start gap-2 list-none',
    className,
  );

  return (
    <li {...props} {...(mergedClassName ? { className: mergedClassName } : {})}>
      {(variant === 'pros' || variant === 'cons') && (
        <span className="mt-[2px] mr-2 shrink-0">
          <Icon
            width={22}
            height={22}
            type={variant === 'pros' ? IconType.TICK_GREEN : IconType.CLOSE_RED}
          />
        </span>
      )}
      {children}
    </li>
  );
};

const SublistElement = ({
  sublist,
  color,
  parentTestId,
}: {
  sublist: SublistProp;
  color: Color;
  parentTestId?: string;
}) => (
  <ListElement
    {...sublist}
    color={sublist.color ?? color}
    className={twMerge(
      'mt-2 ml-6 pl-4',

      sublist.variant === 'unordered' && 'list-[circle]',
      sublist.className,
    )}
    nested={true}
    dataTestId={parentTestId}
  />
);

const ListElementItem = ({
  item,
  variant,
  color,
  parentTestId,
}: {
  item: ListItemElement;
  variant: ListElementProps['variant'];
  color: Color;
  parentTestId?: string;
}) => {
  const isObjectItem =
    typeof item === 'object' && item !== null && 'content' in item;

  const content = isObjectItem ? item.content : item;
  const sublist = isObjectItem ? item.sublist : undefined;

  const itemVariant =
    variant === 'pros' || variant === 'cons' ? variant : undefined;

  return (
    <ListItem
      className={twMerge(
        variant === 'error' &&
          'underline text-base decoration-solid text-red-600 break-words',
      )}
      variant={itemVariant}
    >
      {content}

      {sublist && (
        <SublistElement
          sublist={sublist}
          color={color}
          parentTestId={parentTestId}
        />
      )}
    </ListItem>
  );
};

const getListClassName = ({
  variant,
  color,
  columns,
  items,
  className,
}: Pick<
  ListElementProps,
  'variant' | 'color' | 'columns' | 'items' | 'className'
>) =>
  twMerge(
    'marker:mr-2 marker:pr-2 space-y-2 marker:leading-snug',
    (variant === 'unordered' || variant === 'error') && 'list-disc',
    variant === 'ordered' && 'list-decimal',
    variant === 'error' && 'text-red-600 space-y-4',
    variant === 'error' && items.length < 2 && 'list-none',
    variant === 'none' && 'list-none',
    color === 'magenta' && 'marker:text-pink-800',
    color === 'blue' && 'marker:text-blue-700',
    color === 'pink' && 'marker:text-magenta-500',
    color === 'dark' && 'marker:text-gray-800',
    color === 'red' && 'marker:text-red-600',
    columns === 2 && 'columns-2',
    className,
  );

const getTestId = (testId?: string, nested?: boolean) => {
  if (nested && testId) {
    return `${testId}-nested-list`;
  } else if (nested) {
    return 'nested-list';
  } else {
    return testId;
  }
};

export const ListElement = ({
  variant,
  color,
  className,
  start,
  columns,
  items,
  nested = false,
  dataTestId,
  ...props
}: ListElementProps) => {
  const Element = variant === 'ordered' ? 'ol' : 'ul';
  const testId = getTestId(dataTestId, nested);

  const list = (
    <Element
      {...(props as Record<string, unknown>)}
      start={variant === 'ordered' ? start : -1}
      className={getListClassName({
        variant,
        color,
        columns,
        items,
        className,
      })}
      data-testid={testId}
    >
      {items.map((item, i) => (
        <ListElementItem
          key={`list-key-${i + 1}`}
          item={item}
          variant={variant}
          color={color}
          parentTestId={dataTestId}
        />
      ))}
    </Element>
  );

  return nested ? (
    list
  ) : (
    <div
      data-testid={'list-element'}
      className={twMerge(!columns && 'flex items-center')}
    >
      {variant === 'arrow' && (
        <Icon className="text-magenta-500" type={IconType.ARROW_CURVED} />
      )}
      {list}
    </div>
  );
};
