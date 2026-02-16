import { twMerge } from 'tailwind-merge';

type DetailRowProps = {
  heading: string;
  headingClasses?: string;
  children: React.ReactNode;
};

export const DetailRow = ({
  heading,
  headingClasses,
  children,
}: DetailRowProps) => (
  <tr className="max-md:block border-b-1 border-b-slate-400">
    <td
      className={twMerge(
        'text-left align-top font-bold pt-[10px] pb-[2px] md:pt-[14px] md:pb-4 max-md:block md:w-1/2 lg:w-2/5',
        headingClasses,
      )}
    >
      {heading}
    </td>
    {children}
  </tr>
);
