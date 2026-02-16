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
  showContactLink?: boolean;
};

export const SupportCallout = ({
  showExploreLink = true,
  showUnderstandLink = true,
  showReportLink = true,
  showContactLink = true,
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

  const CONTACT_LINK = {
    href: `/${locale}/contact-us-form`,
    title: t('pages.contact-us.title'),
    testid: 'support-callout-link-contact',
  };

  const links: SupportCalloutLink[] = [
    ...(showExploreLink ? [EXPLORE_LINK] : []),
    ...(showUnderstandLink ? [UNDERSTAND_LINK] : []),
    ...(showReportLink ? [REPORT_LINK] : []),
    ...(showContactLink ? [CONTACT_LINK] : []),
  ];

  return (
    <UrgentCallout variant="arrow" className="mb-24 mt-6 md:mt-[120px]">
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

      <div className="flex flex-col gap-8 lg:flex-row">
        {links.map(({ href, testid, title }) => (
          <Link
            key={testid}
            href={href}
            asButtonVariant="secondary"
            data-testid={testid}
            className="mr-4 leading-6 md:mr-0 text-pretty"
          >
            {title}
          </Link>
        ))}
      </div>
    </UrgentCallout>
  );
};
