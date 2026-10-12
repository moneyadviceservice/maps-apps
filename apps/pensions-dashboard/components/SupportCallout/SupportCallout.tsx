import { twMerge } from 'tailwind-merge';

import { Callout } from '@maps-react/common/components/Callout';
import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

type SupportCalloutLink = {
  href: string;
  title: string;
  testid: string;
};

export type SupportCalloutProps = {
  showExploreLink?: boolean;
  showUnderstandLink?: boolean;
  showContactLink?: boolean;
  className?: string;
};

export const SupportCallout = ({
  showExploreLink = true,
  showUnderstandLink = true,
  showContactLink = true,
  className,
}: SupportCalloutProps) => {
  const { t, locale } = useTranslation();

  const url = (path: string) => `/${locale}/support/${t(path)}`;

  const USING_LINK = {
    href: url('support/using-the-pensions-dashboard.link'),
    title: t('support/using-the-pensions-dashboard.title'),
    testid: 'support-callout-link-using',
  };

  const UNDERSTAND_LINK = {
    href: url('support/understand-your-pensions.link'),
    title: t('support/understand-your-pensions.title'),
    testid: 'support-callout-link-understand',
  };

  const CONTACT_LINK = {
    href: `/${locale}/contact-us-form`,
    title: t('contact-us/title'),
    testid: 'support-callout-link-contact',
  };

  const links: SupportCalloutLink[] = [
    ...(showExploreLink ? [USING_LINK] : []),
    ...(showUnderstandLink ? [UNDERSTAND_LINK] : []),
    ...(showContactLink ? [CONTACT_LINK] : []),
  ];

  return (
    <Callout
      variant="arrow"
      className={twMerge('mb-24 mt-6 md:mt-[120px]', className)}
    >
      <Heading
        level="h3"
        className="mb-4 md:text-3xl"
        data-testid="support-callout-title"
      >
        {t('support/callout.title')}
      </Heading>

      <Paragraph className="mb-6" data-testid="support-callout-content">
        {t('support/callout.content')}
      </Paragraph>

      <div className="flex flex-col gap-4 lg:gap-8 lg:flex-row">
        {links.map(({ href, testid, title }) => (
          <Link
            key={testid}
            href={href}
            asButtonVariant="secondary"
            data-testid={testid}
            className="leading-6 max-lg:w-full max-lg:block max-lg:text-center text-pretty"
          >
            {title}
          </Link>
        ))}
      </div>
    </Callout>
  );
};
