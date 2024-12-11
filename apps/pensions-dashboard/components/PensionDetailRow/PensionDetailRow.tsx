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
  <tr className="border-b-1 border-b-slate-400">
    <td
      className={twMerge('py-3 text-left align-top font-bold', headingClasses)}
    >
      {heading}
    </td>
    {children}
  </tr>
);
