import { twMerge } from 'tailwind-merge';

interface DefinitionTermProps {
  children: React.ReactNode;
  className?: string;
  testId?: string;
}

export const DefinitionTerm = ({
  children,
  className,
  testId,
}: DefinitionTermProps) => {
  return (
    <dt
      className={twMerge(
        'block pt-2 pb-2 max-sm:leading-[1.6] md:border-b-1 md:border-slate-400 md:py-4 lg:pl-2 font-bold',
        className,
      )}
      data-testid={testId ? 'dt-' + testId : 'dt'}
    >
      {children}
    </dt>
  );
};
