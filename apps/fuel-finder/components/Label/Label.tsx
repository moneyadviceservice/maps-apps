import { ReactNode } from 'react';

interface LabelProps {
  htmlFor: string;
  children: ReactNode;
}

const Label = ({ htmlFor, children }: LabelProps) => (
  <label htmlFor={htmlFor} className="block pb-2 text-lg text-gray-800">
    {children}
  </label>
);

export default Label;
