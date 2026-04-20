import { Fragment, ReactNode } from 'react';

interface StringReplaceProps {
  stringValue: string;
  placeholder: string;
  replacePartValue: ReactNode;
  replacementClassName?: string;
}

export const StringReplace = ({
  stringValue,
  placeholder,
  replacePartValue,
  replacementClassName,
}: StringReplaceProps) => {
  const parts = stringValue.split(placeholder);

  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={`${part.replaceAll(' ', '_')}-${index}`}>
          {part}
          {index < parts.length - 1 && (
            <span className={replacementClassName}>{replacePartValue}</span>
          )}
        </Fragment>
      ))}
    </>
  );
};
