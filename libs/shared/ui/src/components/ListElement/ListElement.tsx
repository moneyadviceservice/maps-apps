import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

import { twMerge } from 'tailwind-merge';

import { Icon, IconType } from '../../components/Icon';

type Props = {
  items: ReactNode[] | string[];
  className?: string;
  color: 'magenta' | 'dark' | 'blue' | 'teal' | 'pink' | 'red' | 'none';
  start?: number;
  columns?: 1 | 2;
};

export type ListElementProps =
  | (DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement> &
      Props & {
        variant: 'unordered' | 'arrow' | 'pros' | 'cons' | 'error';
      })
  | (DetailedHTMLProps<HTMLAttributes<HTMLOListElement>, HTMLOListElement> &
      Props & {
        variant: 'ordered';
      })
  | (DetailedHTMLProps<HTMLAttributes<HTMLOListElement>, HTMLOListElement> &
      Props & {
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

export const ListElement = ({
  variant,
  color,
  className,
  start,
  columns,
  items,
  ...props
}: ListElementProps) => {
  const Element: any = variant === 'ordered' ? 'ol' : 'ul';

  return (
    <div
      data-testid="list-element"
      className={twMerge(!columns && 'flex items-center')}
    >
      {variant === 'arrow' && (
        <Icon className="text-magenta-500" type={IconType.ARROW_CURVED} />
      )}
      <Element
        {...props}
        start={variant === 'ordered' ? start : '-1'}
        className={twMerge(
          'marker:mr-2 marker:pr-2 space-y-2 marker:leading-snug',
          (variant === 'unordered' || variant === 'error') && ['list-disc'],
          variant === 'ordered' && ['list-decimal'],
          variant === 'error' && ['text-red-600 space-y-4'],
          variant === 'error' && items.length < 2 && ['list-none'],
          variant === 'none' && ['list-none'],
          color === 'magenta' && ['marker:text-pink-800'],
          color === 'blue' && ['marker:text-blue-700'],
          color === 'pink' && ['marker:text-magenta-500'],
          color === 'dark' && ['marker:text-gray-800'],
          color === 'red' && ['marker:text-red-600'],
          columns === 2 && 'columns-2',
          className,
        )}
      >
        {items.map((item, i) => {
          return (
            <ListItem
              key={i}
              className={twMerge(
                variant === 'error' && [
                  'underline text-base decoration-solid text-red-600 break-words',
                ],
              )}
              variant={
                variant === 'pros' || variant === 'cons' ? variant : undefined
              }
            >
              {item}
            </ListItem>
          );
        })}
      </Element>
    </div>
  );
};
