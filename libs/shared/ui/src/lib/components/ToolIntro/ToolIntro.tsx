import { ReactNode } from 'react';
import classNames from 'classnames';

export type ToolIntroProps = {
  children: ReactNode;
  className?: string;
  testId?: string;
};

export const ToolIntro = ({
  children,
  className,
  testId = 'tool-intro',
}: ToolIntroProps) => {
  return (
    <div
      className={classNames(
        't-tool-intro border-l-[6px] border-teal-300 pl-6 text-lg text-gray-800 font-normal leading-[26px]',
        className,
      )}
      data-testid={testId}
    >
      {children}
    </div>
  );
};