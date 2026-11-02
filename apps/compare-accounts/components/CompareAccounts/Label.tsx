import { twMerge } from 'tailwind-merge';

interface LabelProps {
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}

const Label = ({ htmlFor, children, className }: LabelProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className={twMerge(
        'text-md',
        'text-gray-800',
        'mb-1',
        'block',
        className,
      )}
    >
      {children}
    </label>
  );
};

export default Label;
