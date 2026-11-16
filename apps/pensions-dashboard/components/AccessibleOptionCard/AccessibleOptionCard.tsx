import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { Markdown } from '@maps-react/vendor/components/Markdown';

export type AccessibleOptionCardProps = {
  title: string;
  toggleLabel: string;
  icon: IconType;
  intro: string;
  ctaHref?: string;
  ctaLabel?: string;
  testId?: string;
};

export const AccessibleOptionCard = ({
  title,
  toggleLabel,
  icon,
  intro,
  ctaHref,
  ctaLabel,
  testId,
}: AccessibleOptionCardProps) => (
  <div
    className="flex flex-col items-center h-full min-h-0 gap-6 p-4 overflow-hidden text-base font-normal leading-relaxed text-gray-800 bg-gray-100 border-b-4 border-gray-300 rounded-lg"
    data-testid={testId}
  >
    <Heading
      level="h3"
      fontWeight="font-bold"
      color="text-gray-800"
      className="w-full max-w-full mb-0 text-xl leading-snug text-center shrink-0 md:text-xl"
    >
      {title}
    </Heading>

    <Icon
      type={icon}
      className="block object-contain text-blue-700 size-16 shrink-0 md:size-20"
      aria-hidden
    />

    <ExpandableSection
      title={toggleLabel}
      variant="hyperlink"
      testClassName="font-bold"
      className="self-stretch flex-1 w-full min-h-0 text-left"
    >
      <Markdown content={intro} />
      {ctaHref && ctaLabel && (
        <Link
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          asInlineText
          withIcon={!/^tel:/i.test(ctaHref)}
          className="font-semibold"
        >
          {ctaLabel}
        </Link>
      )}
    </ExpandableSection>
  </div>
);
