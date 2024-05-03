import { ReactNode, HTMLAttributes } from 'react';
import classNames from 'classnames';

export type ParagraphProps = HTMLAttributes<HTMLParagraphElement> & {
  className?: string;
  testClassName?: string;
  children: ReactNode;
  testId?: string;
};

export const Paragraph = ({
  className,
  testClassName = '',
  testId = 'paragraph',
  children,
  ...props
}: ParagraphProps) => {
  return (
    <p
      className={classNames('mb-4', className, testClassName)}
      data-testid={testId}
      {...props}
    >
      {children}
    </p>
  );
};
