import { ReactNode } from 'react';

import Image from 'next/image';

import { H5 } from '../../components/Heading';

export type ContentCardProps = {
  title: string;
  image?: {
    src: string;
    alt: string;
  };
  children: ReactNode;
  testId?: string;
  className?: string;
  headingClassName?: string;
};

export const ContentCard = ({
  children,
  title,
  image,
  testId = 'content-card',
  className = '',
  headingClassName = '',
}: ContentCardProps) => {
  return (
    <div
      data-testid={testId}
      className={`border-1 border-slate-400 rounded-bl-[36px] print:border-none print:shadow-none print:w-full ${className}`}
    >
      {image ? (
        <Image
          src={image.src}
          className="print:hidden"
          alt={image.alt}
          width={408}
          height={204}
        />
      ) : null}
      <H5 component="h3" className={`m-4 ${headingClassName}`}>
        {title}
      </H5>
      <div className="pb-4 mx-4 text-lg text-gray-800">{children}</div>
    </div>
  );
};
