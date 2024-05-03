import { HTMLAttributes } from 'react';
import classNames from 'classnames';
import { Icon, IconType } from '../../components/Icon';

export type UrgentCalloutProps = {
  variant: 'warning' | 'calculator' | 'arrow';
  border?: 'yellow' | 'teal';
  testId?: string;
} & Pick<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'children'>;

export const UrgentCallout = ({
  style,
  className,
  children,
  variant,
  border,
  testId = 'urgent-callout',
}: UrgentCalloutProps) => {
  const borderClasses =
    border === 'teal' ? 'border-teal-300' : 'border-yellow-200';

  return variant === 'arrow' ? (
    <div
      style={style}
      className={classNames(
        't-urgent-callout border-8 rounded-bl-3xl py-10 pl-6 pr-8 sm:p-10 flex',
        borderClasses,
        className,
      )}
      data-testid={testId}
    >
      <div className="flex gap-3 sm:gap-6">
        <div className={classNames('text-pink-800', 'sm:hidden', '-ml-8')}>
          <Icon type={IconType.ARROW_BRAND_STRAIGHT} />
        </div>
        <div
          className={classNames(
            'text-pink-800',
            'hidden sm:block',
            '-mt-12',
            '-ml-4',
          )}
        >
          <Icon type={IconType.ARROW_BRAND_CURVED} />
        </div>
        <div>{children}</div>
      </div>
    </div>
  ) : variant === 'calculator' ? (
    <div
      style={style}
      data-testid={testId}
      className={classNames(
        't-urgent-callout border-8 rounded-bl-3xl py-10 pl-6 pr-8 sm:p-10 flex',
        borderClasses,
        className,
      )}
    >
      <div className="flex gap-4 sm:gap-6">
        <div className={classNames('text-pink-800')}>
          <Icon type={IconType.CALCULATOR} />
        </div>
        <div>{children}</div>
      </div>
    </div>
  ) : variant === 'warning' ? (
    <div
      style={style}
      data-testid={testId}
      className={classNames(
        't-urgent-callout border-8 rounded-bl-3xl py-10 pl-6 pr-8 sm:p-10 flex',
        borderClasses,
        className,
      )}
    >
      <div className="flex gap-4 sm:gap-6">
        <div className={classNames('text-pink-800')}>
          <Icon type={IconType.WARNING} />
        </div>
        <div>{children}</div>
      </div>
    </div>
  ) : null;
};
