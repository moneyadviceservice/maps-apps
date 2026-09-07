import { useEffect, useState } from 'react';

import { GetServerSideProps, NextPage } from 'next';

import { Button } from '@maps-react/common/components/Button';
import { Errors } from '@maps-react/common/components/Errors';
import { Heading } from '@maps-react/common/components/Heading';
import { IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { AccessibleOptionCard } from '../../../components/AccessibleOptionCard';
import { ContactUsCard } from '../../../components/ContactUsCard';
import { PensionsDashboardLayout } from '../../../layouts/PensionsDashboardLayout';
import { useLiveChat, useMHPDAnalytics } from '../../../lib/hooks';
import {
  Cookies,
  getMhpdSessionConfig,
  storeCurrentUrl,
} from '../../../lib/utils/system';

const ACCESSIBLE_CONTACT_OPTIONS = [
  { type: 'relay', icon: IconType.RELAY_UK },
  { type: 'bsl', icon: IconType.BSL },
  { type: 'interpreter', icon: IconType.INTERPRETER },
] as const;

type PageProps = {
  backLink: string;
  userSessionId: string;
};

const Page: NextPage<PageProps> = ({ backLink, userSessionId }) => {
  const { t, locale } = useTranslation();
  const { t: tEn } = useTranslation('en');
  const titleKey = 'contact-us/title';
  const title = t(titleKey);

  const contactFormBaseUrl =
    locale === 'cy'
      ? process.env.NEXT_PUBLIC_CONTACT_FORM_URL_CY
      : process.env.NEXT_PUBLIC_CONTACT_FORM_URL_EN;

  const whatsAppNumber =
    locale === 'cy'
      ? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_CY
      : process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_EN;

  const whatsAppNumberFormatted = whatsAppNumber
    ? `+44 (0)${whatsAppNumber.slice(2, 6)} ${whatsAppNumber.slice(6)}`
    : '';

  const contactFormUrl = contactFormBaseUrl
    ? `${contactFormBaseUrl}&sessionID=${userSessionId}`
    : '';

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
      backText={backLink ? t('support/back-text') : undefined}
      showToolFeedBack={false}
    >
      <div className="lg:w-5/6 xl:w-2/3 2xl:w-7/12">
        <ToolIntro className="mt-8 mb-12 text-2xl md:mt-12 md:mb-16">
          {t('contact-us/intro')}
        </ToolIntro>

        <div className="grid w-full min-w-0 grid-cols-1 gap-8 lg:grid-cols-2 lg:items-stretch">
          <ContactUsCard
            title={t('contact-us/webchat.title')}
            icon={IconType.CONTACT_WEB_CHAT}
            subtitle={t('contact-us/webchat.subtitle')}
            availability={t('contact-us/webchat.availability')}
          >
            <noscript>
              <Errors
                errors={['webchat-js-required']}
                className="py-1 text-base leading-snug text-gray-800"
              >
                {t('contact-us/webchat.js-notice')}
              </Errors>
            </noscript>
            <Button
              type="button"
              variant="primary"
              className={btnFullWidth}
              disabled={!isWebchatReady}
              onClick={() => toggleChat()}
            >
              {t('contact-us/webchat.button')}
            </Button>
            <Markdown
              content={t('contact-us/webchat.description')}
              className="mb-0"
            />
          </ContactUsCard>

          <ContactUsCard
            title={t('contact-us/phone.title')}
            icon={IconType.CONTACT_TELEPHONE}
            subtitle={t('contact-us/phone.subtitle')}
            availability={t('contact-us/phone.availability')}
          >
            <Link
              href={t('contact-us/phone.tel')}
              asButtonVariant="primary"
              className={btnFullWidth}
            >
              {t('contact-us/phone.button')}
            </Link>
            <Markdown
              content={t('contact-us/phone.description')}
              className="mb-0"
            />
          </ContactUsCard>

          <ContactUsCard
            title={t('contact-us/online-form.title')}
            icon={IconType.CONTACT_WEB_FORM}
            subtitle={t('contact-us/online-form.subtitle')}
            availability={t('contact-us/online-form.availability')}
          >
            <Link
              href={contactFormUrl}
              asButtonVariant="primary"
              target="_blank"
              rel="noopener noreferrer"
              className={btnFullWidth}
              data-testid="contact-form-button"
            >
              {t('contact-us/online-form.button')}
            </Link>
            <Markdown
              content={t('contact-us/online-form.description')}
              className="mb-0"
            />
          </ContactUsCard>

          <ContactUsCard
            title={t('contact-us/whatsapp.title')}
            icon={IconType.CONTACT_WEB_FORM}
            subtitle={t('contact-us/whatsapp.subtitle')}
            availability={t('contact-us/whatsapp.availability')}
          >
            <Link
              href={`https://wa.me/${whatsAppNumber}`}
              asButtonVariant="primary"
              target="_blank"
              rel="noopener noreferrer"
              className={btnFullWidth}
              data-testid="whatsapp-button"
              withIcon={false}
            >
              {whatsAppNumberFormatted}
            </Link>
            <Markdown
              content={t('contact-us/whatsapp.description')}
              className="mb-0"
            />
          </ContactUsCard>
        </div>
      </div>

      <div className="w-full mt-12 lg:mt-16">
        <Heading level="h2" className="mb-8 md:max-w-4xl">
          {t('contact-us/accessible-options.heading')}
        </Heading>
      </div>

      <div className="lg:w-5/6 xl:w-2/3 2xl:w-7/12">
        <div className="grid w-full min-w-0 grid-cols-1 gap-8 lg:grid-cols-3 lg:items-stretch">
          {ACCESSIBLE_CONTACT_OPTIONS.map(({ type, icon }) => {
            const prefix = `contact-us/accessible-options.${type}`;

            return (
              <AccessibleOptionCard
                key={type}
                testId={`contact-us-accessible-option-${type}`}
                title={t(`${prefix}.title`)}
                toggleLabel={t(`${prefix}.toggle`)}
                icon={icon}
                intro={t(`${prefix}.intro`)}
                ctaHref={t(`${prefix}.cta.href`)}
                ctaLabel={t(`${prefix}.cta.label`)}
              />
            );
          })}
        </div>
      </div>

      <div className="max-w-4xl mt-10">
        <Markdown content={t('contact-us/complaint-link')} />
      </div>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = new Cookies(context.req, context.res);
  const { currentUrl, userSessionId } = getMhpdSessionConfig(cookies);
  storeCurrentUrl(context, undefined, true);

  const isDashboardPage =
    currentUrl && currentUrl !== '/' && currentUrl.length > 1;

  const backLink = isDashboardPage ? currentUrl : null;

  return {
    props: {
      backLink,
      userSessionId,
    },
  };
};
