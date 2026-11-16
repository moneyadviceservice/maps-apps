import { twMerge } from 'tailwind-merge';

import { H2, Heading, Link, Paragraph } from '@maps-react/common/index';
import useTranslation from '@maps-react/hooks/useTranslation';

export const getErrorPageContent = (
  lang: string,
  t: ReturnType<typeof useTranslation>['t'],
) => {
  return (
    <div className={twMerge('lg:max-w-[840px] space-y-8 pt-8 lg:pt-16')}>
      <Heading data-testid="error-page-heading">
        {t('error-page.heading')}
      </Heading>
      <Paragraph>{t('error-page.description')}</Paragraph>
      <H2>{t('error-page.whatYouCanDo')}</H2>
      <ul className="pl-8 space-y-2 list-disc">
        <li>
          {t('error-page.homepageText')}{' '}
          <Link
            href="https://maps.org.uk"
            className="text-magenta-800 text-[18px] font-bold"
          >
            {t('error-page.homepageLink')}
          </Link>
        </li>
        <li>
          {t('error-page.hubText')}{' '}
          <Link
            href={`/${lang}/learning-pathway`}
            className="text-magenta-800 text-[18px] font-bold"
          >
            {t('error-page.hubLink')}
          </Link>
        </li>
        <li>{t('error-page.searchText')}</li>
      </ul>
    </div>
  );
};
