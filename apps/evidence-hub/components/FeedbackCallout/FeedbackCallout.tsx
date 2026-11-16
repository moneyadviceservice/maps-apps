import { twMerge } from 'tailwind-merge';

import { Link } from '@maps-react/common/components/Link';

const FEEDBACK_EMAIL = 'what.works@maps.org.uk';

const textClasses = 'font-medium leading-[1.6] tracking-[0.18px]';

type Props = {
  className?: string;
};

export const FeedbackCallout = ({ className }: Props) => (
  <div
    className={twMerge('flex flex-col gap-[19px] p-4 bg-gray-100', className)}
    data-testid="feedback-callout"
  >
    <p className={textClasses}>Give us your feedback or ask a question</p>
    <Link href={`mailto:${FEEDBACK_EMAIL}`} className={textClasses}>
      {FEEDBACK_EMAIL}
    </Link>
  </div>
);
