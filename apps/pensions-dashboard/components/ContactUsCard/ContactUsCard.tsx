import type { ReactNode } from 'react';

import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Paragraph } from '@maps-react/common/components/Paragraph';

export type ContactUsCardProps = {
  title: string;
  icon: IconType;
  subtitle: string;
  availability: string;
  heading: string;
  children: ReactNode;
};

export const ContactUsCard = ({
  title,
  icon,
  subtitle,
  availability,
  heading,
  children,
}: ContactUsCardProps) => {
  return (
    <div className="flex flex-col h-full overflow-hidden rounded-lg">
      <div className="flex flex-col items-center gap-2 px-6 py-3 text-center text-white bg-magenta-500 md:py-4">
        <Heading
          level="h3"
          color="text-white"
          fontWeight="font-semibold"
          className="text-4xl leading-tight"
        >
          {title}
        </Heading>
        <Icon
          type={icon}
          className="h-11 w-11 shrink-0 md:h-12 md:w-12 [&_path]:fill-white"
          aria-hidden
        />
        <Paragraph className="mb-0 text-sm leading-normal text-white md:text-base">
          {subtitle}
        </Paragraph>
      </div>

      <div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-white border-b-4 border-gray-300 rounded-b-lg border-x">
        <div className="px-4 py-4 border-b border-gray-300 md:py-5">
          <Paragraph className="mb-0 text-base font-bold leading-snug text-center text-magenta-500">
            {availability}
          </Paragraph>
        </div>

        <div className="flex flex-col flex-1 min-h-0 gap-4 p-4 text-base font-normal leading-relaxed text-gray-800">
          <Heading
            level="h4"
            variant="secondary"
            fontWeight="font-bold"
            className="text-3xl leading-tight"
          >
            {heading}
          </Heading>
          {children}
        </div>
      </div>
    </div>
  );
};
