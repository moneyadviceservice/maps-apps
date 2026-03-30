import { twMerge } from 'tailwind-merge';

import { H2 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';

type PensionDetailHeadingProps = {
  title: string;
  subHeading?: string;
};

export const PensionDetailHeading = ({
  title,
  subHeading,
}: PensionDetailHeadingProps) => {
  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-4">
      <div className="lg:col-span-8 2xl:col-span-7">
        <H2
          data-testid="heading"
          className={twMerge(
            'mt-2 md:text-5xl',
            subHeading ? 'mb-10 md:mb-4' : 'mb-10 md:mb-12',
          )}
          id="details-heading"
          tabIndex={-1}
        >
          {title}
        </H2>
        {subHeading && (
          <Paragraph data-testid="sub-heading" className="mb-12 leading-[1.6]">
            {subHeading}
          </Paragraph>
        )}
      </div>
    </div>
  );
};
