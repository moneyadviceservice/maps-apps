import { ReactNode } from 'react';

import { twMerge } from 'tailwind-merge';

export enum NotificationBoxVariant {
  DEFAULT = 'default',
  POSITIVE = 'positive',
  WARNING = 'warning',
  NEGATIVE = 'negative',
  INFORMATION = 'information',
  WHITE = 'white',
  INFORMATION_MAGENTA = 'information-magenta',
  INFORMATION_TEAL = 'information-teal',
  INFORMATION_BLUE = 'information-blue',
}

export type NotificationBoxProps = {
  variant?:
    | NotificationBoxVariant.DEFAULT
    | NotificationBoxVariant.POSITIVE
    | NotificationBoxVariant.WARNING
    | NotificationBoxVariant.NEGATIVE
    | NotificationBoxVariant.INFORMATION
    | NotificationBoxVariant.WHITE
    | NotificationBoxVariant.INFORMATION_MAGENTA
    | NotificationBoxVariant.INFORMATION_TEAL
    | NotificationBoxVariant.INFORMATION_BLUE;
  children: ReactNode;
  testId?: string;
  className?: string;
};

const {
  DEFAULT,
  POSITIVE,
  WARNING,
  NEGATIVE,
  INFORMATION,
  WHITE,
  INFORMATION_MAGENTA,
  INFORMATION_TEAL,
  INFORMATION_BLUE,
} = NotificationBoxVariant;

export const NotificationBox = ({
  children,
  testId,
  variant = DEFAULT,
  className,
}: NotificationBoxProps) => {
  const getClassname = () => {
    switch (variant) {
      case POSITIVE:
        return 'bg-green-100 before:bg-green-700';
      case WARNING:
        return 'bg-yellow-150 before:bg-amber-500';
      case NEGATIVE:
        return 'bg-red-100 before:bg-red-700';
      case INFORMATION:
        return 'bg-gray-100 before:bg-teal-700';
      case WHITE:
        return 'bg-white before:bg-teal-700';
      case INFORMATION_MAGENTA:
        return 'bg-gray-100 before:bg-magenta-500';
      case INFORMATION_TEAL:
        return 'bg-gray-100 before:bg-gray-800';
      case INFORMATION_BLUE:
        return 'bg-blue-300 before:bg-blue-600';
      default:
        return 'bg-blue-100 before:bg-blue-700';
    }
  };

  const beforeClasses = `before:content-[""] before:block before:h-[80px] before:w-[8px] before:absolute before:left-0 before:top-0 before:rounded-bl-[8px]`;

  return (
    <div
      className={twMerge(
        'relative min-h-[95px] p-6 rounded-bl-3xl',
        beforeClasses,
        getClassname(),
        className,
      )}
      data-testid={`notification-box-${variant}${testId ? '-' + testId : ''}`}
    >
      {children}
    </div>
  );
};
