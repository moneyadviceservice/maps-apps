import { twMerge } from 'tailwind-merge';

import { Callout } from '@maps-react/common/components/Callout';
import { Heading } from '@maps-react/common/components/Heading';
import { Markdown } from '@maps-react/vendor/components/Markdown';

export type SummaryResultsCalloutNoticeProps = {
  title: string;
  content: string;
  variant?: 'primary' | 'secondary';
};

export const SummaryResultsCalloutNotice = ({
  title,
  content,
  variant = 'secondary',
}: SummaryResultsCalloutNoticeProps) => {
  return (
    <Callout className="p-10 pt-6 space-y-4">
      <Heading component="h3" level="h4" className="text-2xl">
        {title}
      </Heading>
      <Markdown
        content={content}
        className={twMerge('text-base', variant === 'primary' && 'md:text-2xl')}
        withIcon={false}
      />
    </Callout>
  );
};
