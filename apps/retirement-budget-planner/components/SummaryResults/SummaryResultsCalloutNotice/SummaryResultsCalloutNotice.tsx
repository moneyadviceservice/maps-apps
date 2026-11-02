import { twMerge } from 'tailwind-merge';

import { Heading } from '@maps-react/common/components/Heading';
import { NotificationBox } from '@maps-react/common/components/NotificationBox';
import { Markdown } from '@maps-react/vendor/components/Markdown';

export type SummaryResultsCalloutNoticeProps = {
  title: string;
  content: string;
  variant?: 'primary' | 'secondary';
  titleTestId?: string;
};

export const SummaryResultsCalloutNotice = ({
  title,
  content,
  variant = 'secondary',
  titleTestId,
}: SummaryResultsCalloutNoticeProps) => {
  return (
    <NotificationBox className="p-10 pt-6 space-y-4">
      <Heading
        component="h3"
        level="h4"
        className="text-2xl"
        data-testid={titleTestId}
      >
        {title}
      </Heading>
      <Markdown
        content={content}
        className={twMerge('text-base', variant === 'primary' && 'md:text-2xl')}
      />
    </NotificationBox>
  );
};
