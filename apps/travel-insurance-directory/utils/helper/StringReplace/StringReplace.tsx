import { Fragment, ReactNode } from 'react';

interface StringReplaceProps {
  stringValue: string;
  placeholder: string;
  replacePartValue: ReactNode;
}

export const StringReplace = ({
  stringValue,
  placeholder,
  replacePartValue,
}: StringReplaceProps) => {
  const parts = stringValue.split(placeholder);

  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={`${part.replaceAll(' ', '_')}-${index}`}>
          {part}
          {index < parts.length - 1 && replacePartValue}
        </Fragment>
      ))}
    </>
  );
};
