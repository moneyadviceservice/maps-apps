import { Callout } from '@maps-react/common/components/Callout';
import { Heading } from '@maps-react/common/components/Heading';
import { Markdown } from '@maps-react/vendor/components/Markdown';

export type SummaryResultsCalloutNoticeProps = {
  title: string;
  content: string;
};

export const SummaryResultsCalloutNotice = ({
  title,
  content,
}: SummaryResultsCalloutNoticeProps) => {
  return (
    <Callout className="p-10 pt-6 space-y-4">
      <Heading component="h3" level="h4">
        {title}
      </Heading>
      <Markdown content={content} className="text-2xl" />
    </Callout>
  );
};
