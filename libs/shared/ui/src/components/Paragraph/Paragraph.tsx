import { HTMLAttributes, ReactNode } from 'react';

import { twMerge } from 'tailwind-merge';

export type ParagraphProps = HTMLAttributes<HTMLParagraphElement> & {
  className?: string;
  testClassName?: string;
  children: ReactNode;
  testId?: string;
  variant?: 'primary' | 'secondary';
  hasGlassBoxClass?: boolean;
};

export const Paragraph = ({
  className,
  testClassName = '',
  testId = 'paragraph',
  children,
  variant = 'primary',
  hasGlassBoxClass = false,
  ...props
}: ParagraphProps) => {
  return (
    <p
      className={twMerge(
        'mb-4',
        className,
        testClassName,
        variant === 'secondary' && 'text-blue-700',
        hasGlassBoxClass && 'obfuscate',
      )}
      data-testid={testId}
      {...props}
    >
      {children}
    </p>
  );
};
