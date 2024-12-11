import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { UrgentCallout } from '@maps-react/common/components/UrgentCallout';
import { useTranslation } from '@maps-react/hooks/useTranslation';

type SupportCalloutLink = {
  href: string;
  title: string;
  testid: string;
};

export type SupportCalloutProps = {
  showExploreLink?: boolean;
  showUnderstandLink?: boolean;
  showReportLink?: boolean;
};

export const SupportCallout = ({
  showExploreLink = true,
  showUnderstandLink = true,
  showReportLink = true,
}: SupportCalloutProps) => {
  const { t, locale } = useTranslation();

  const url = (path: string) => `/${locale}/support/${t(path)}`;

  const EXPLORE_LINK = {
    href: url('pages.support.explore-the-pensions-dashboard.link'),
    title: t('pages.support.explore-the-pensions-dashboard.title'),
    testid: 'support-callout-link-explore',
  };

  const UNDERSTAND_LINK = {
    href: url('pages.support.understand-your-pensions.link'),
    title: t('pages.support.understand-your-pensions.title'),
    testid: 'support-callout-link-understand',
  };

  const REPORT_LINK = {
    href: url('pages.support.report-a-technical-problem.link'),
    title: t('pages.support.report-a-technical-problem.title'),
    testid: 'support-callout-link-report',
  };

  const links: SupportCalloutLink[] = [
    ...(showExploreLink ? [EXPLORE_LINK] : []),
    ...(showUnderstandLink ? [UNDERSTAND_LINK] : []),
    ...(showReportLink ? [REPORT_LINK] : []),
  ];

  return (
    <UrgentCallout variant="arrow" className="mt-24">
      <Heading
        level="h3"
        className="mb-4 md:text-3xl"
        data-testid="support-callout-title"
      >
        {t('pages.support.callout.title')}
      </Heading>

      <Paragraph className="mb-6" data-testid="support-callout-content">
        {t('pages.support.callout.content')}
      </Paragraph>

      <div className="flex flex-row gap-8">
        {links.map(({ href, testid, title }, index) => (
          <Link
            key={index}
            href={href}
            asButtonVariant="secondary"
            data-testid={testid}
          >
            {title}
          </Link>
        ))}
      </div>
    </UrgentCallout>
  );
};
