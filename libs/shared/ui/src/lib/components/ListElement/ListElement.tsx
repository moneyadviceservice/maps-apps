import classNames from 'classnames';
import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import { Icon, IconType } from '../../components/Icon';

type Props = {
  items: ReactNode[] | string[];
  className?: string;
  color: 'magenta' | 'dark' | 'blue' | 'teal' | 'pink';
  start?: number;
};

export type ListElementProps =
  | (DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement> &
      Props & {
        variant: 'unordered' | 'arrow';
      })
  | (DetailedHTMLProps<HTMLAttributes<HTMLOListElement>, HTMLOListElement> &
      Props & {
        variant: 'ordered';
      });

type ListItemProps = DetailedHTMLProps<
  HTMLAttributes<HTMLLIElement>,
  HTMLLIElement
> & {
  children: ReactNode | undefined;
  className?: string;
};

const ListItem = ({ className, children, ...props }: ListItemProps) => {
  return (
    <li {...props} className={className}>
      {children}
    </li>
  );
};

export const ListElement = ({
  variant,
  color,
  className,
  start,
  items,
  ...props
}: ListElementProps) => {
  const Element: any = variant === 'ordered' ? 'ol' : 'ul';

  return (
    <div data-testid="list-element" className="flex items-center">
      {variant === 'arrow' && (
        <Icon className="text-pink-600" type={IconType.ARROW_CURVED} />
      )}
      <Element
        {...props}
        start={variant === 'ordered' ? start : '-1'}
        className={classNames(
          className,
          {
            'list-disc': variant === 'unordered',
            'list-decimal': variant === 'ordered',
            'marker:text-pink-800': color === 'magenta',
            'marker:text-blue-800': color === 'blue',
          },
          'marker:mr-2 marker:pr-2 space-y-2 marker:leading-snug',
        )}
      >
        {items.map((v, i) => {
          return <ListItem key={i}>{v}</ListItem>;
        })}
      </Element>
    </div>
  );
};
