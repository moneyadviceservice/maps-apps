import { useEffect, useState } from 'react';

import { GetServerSideProps, NextPage } from 'next';

import { Button } from '@maps-react/common/components/Button';
import { Divider } from '@maps-react/common/components/Divider';
import { Errors } from '@maps-react/common/components/Errors';
import { Heading } from '@maps-react/common/components/Heading';
import { IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { ContactUsCard } from '../../../components/ContactUsCard';
import { PensionsDashboardLayout } from '../../../layouts/PensionsDashboardLayout';
import { useLiveChat, useMHPDAnalytics } from '../../../lib/hooks';
import {
  Cookies,
  getMhpdSessionConfig,
  storeCurrentUrl,
} from '../../../lib/utils/system';

type PageProps = {
  backLink: string;
};

const Page: NextPage<PageProps> = ({ backLink }) => {
  const { t, locale } = useTranslation();
  const { t: tEn } = useTranslation('en');
  const titleKey = 'pages.contact-us.title';
  const title = t(titleKey);

  const contactFormUrl = process.env.NEXT_PUBLIC_CONTACT_FORM_URL ?? '';

  const btnFullWidth =
    'inline-flex w-full justify-center text-center font-semibold shadow-bottom-gray';

  const { toggleChat } = useLiveChat();

  const [isWebchatReady, setIsWebchatReady] = useState(false);
  useEffect(() => {
    setIsWebchatReady(true);
  }, []);

  // Track analytics for this page
  useMHPDAnalytics({
    pageTitle: tEn(titleKey),
    pageName: tEn(titleKey),
  });

  return (
    <PensionsDashboardLayout
      title={title}
      isOffset={false}
      back={backLink ? `/${locale}${backLink}` : undefined}
      backText={backLink ? t('pages.support.back-text') : undefined}
    >
      <div className="md:max-w-4xl">
        <ToolIntro className="mb-6 leading-7 md:mb-8 md:text-2xl">
          {t('pages.contact-us.intro')}
        </ToolIntro>

        <Paragraph className="mb-8 text-lg" testId="contact-us-intro-paragraph">
          {t('pages.contact-us.content')}
        </Paragraph>

        <Heading level="h2" className="mb-8">
          {t('pages.contact-us.sub-heading')}
        </Heading>
      </div>

      <div className="grid w-full min-w-0 grid-cols-1 gap-8 lg:grid-cols-3 lg:items-stretch">
        <ContactUsCard
          title={t('pages.contact-us.webchat.title')}
          icon={IconType.CONTACT_WEB_CHAT}
          subtitle={t('pages.contact-us.webchat.subtitle')}
          availability={t('pages.contact-us.webchat.availability')}
          heading={t('pages.contact-us.webchat.heading')}
        >
          <noscript>
            <Errors
              errors={['webchat-js-required']}
              className="py-1 text-base leading-snug text-gray-800"
            >
              {t('pages.contact-us.webchat.js-notice')}
            </Errors>
          </noscript>
          <Button
            type="button"
            variant="primary"
            className={btnFullWidth}
            disabled={!isWebchatReady}
            onClick={() => toggleChat()}
          >
            {t('pages.contact-us.webchat.button')}
          </Button>
          <Markdown
            content={t('pages.contact-us.webchat.description')}
            className="mb-0"
          />
        </ContactUsCard>

        <ContactUsCard
          title={t('pages.contact-us.phone.title')}
          icon={IconType.CONTACT_TELEPHONE}
          subtitle={t('pages.contact-us.phone.subtitle')}
          availability={t('pages.contact-us.phone.availability')}
          heading={t('pages.contact-us.phone.heading')}
        >
          <Link
            href={t('pages.contact-us.phone.en.tel')}
            asButtonVariant="primary"
            withIcon={false}
            className={btnFullWidth}
          >
            {t('pages.contact-us.phone.en.button')}
          </Link>
          <Link
            href={t('pages.contact-us.phone.cy.tel')}
            asButtonVariant="secondary"
            withIcon={false}
            className={btnFullWidth}
          >
            {t('pages.contact-us.phone.cy.button')}
          </Link>
          <Markdown
            content={t('pages.contact-us.phone.description')}
            className="mb-0"
          />
        </ContactUsCard>

        <ContactUsCard
          title={t('pages.contact-us.online-form.title')}
          icon={IconType.CONTACT_WEB_FORM}
          subtitle={t('pages.contact-us.online-form.subtitle')}
          availability={t('pages.contact-us.online-form.availability')}
          heading={t('pages.contact-us.online-form.heading')}
        >
          <Link
            href={contactFormUrl}
            asButtonVariant="primary"
            target="_blank"
            rel="noopener noreferrer"
            className={btnFullWidth}
            data-testid="contact-form-button"
          >
            {t('pages.contact-us.online-form.button')}
          </Link>
          <Markdown
            content={t('pages.contact-us.online-form.description')}
            className="mb-0"
          />
        </ContactUsCard>
      </div>

      <div className="max-w-4xl mt-10">
        <Divider />
        <Markdown content={t('pages.contact-us.complaint-link')} />
      </div>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = new Cookies(context.req, context.res);
  const { currentUrl } = getMhpdSessionConfig(cookies);
  storeCurrentUrl(context, undefined, true);

  const isDashboardPage =
    currentUrl && currentUrl !== '/' && currentUrl.length > 1;

  const backLink = isDashboardPage ? currentUrl : null;

  return {
    props: {
      backLink,
    },
  };
};
