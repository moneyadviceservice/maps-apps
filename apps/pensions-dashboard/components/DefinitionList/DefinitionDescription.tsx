import { twMerge } from 'tailwind-merge';

interface DefinitionDescriptionProps {
  children: React.ReactNode;
  className?: string;
  testId?: string;
}

export const DefinitionDescription = ({
  children,
  className,
  testId,
}: DefinitionDescriptionProps) => {
  return (
    <dd
      className={twMerge(
        'block pb-2 leading-[1.6] border-b-1 border-slate-400 md:py-4',
        className,
      )}
      data-testid={testId ? 'dd-' + testId : 'dd'}
    >
      {children}
    </dd>
  );
};
