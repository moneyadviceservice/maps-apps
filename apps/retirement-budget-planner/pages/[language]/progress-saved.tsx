import { useEffect, useState } from 'react';

import { GetServerSideProps } from 'next';

import { useSessionId } from 'context/SessionContextProvider';
import { RetirementPlannerWrapper } from 'layout/RetirementPlannerWrapper';

import { H1, H3 } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';
type ProgressSavedPageProps = {
  isEmbedded: boolean;
  tabName?: string;
  sessionId?: string | null;
  language?: string;
  email1: string;
  email2?: string;
};
const ProgressSaved = ({
  isEmbedded,
  tabName,
  sessionId,
  language,
  email1,
  email2,
}: ProgressSavedPageProps) => {
  const [isJsEnabled, setIsJsEnabled] = useState(false);
  useEffect(() => {
    setIsJsEnabled(true);
  }, []);
  const sessionIdFromContext = useSessionId();
  const { t } = useTranslation();

  return (
    <RetirementPlannerWrapper
      isEmbedded={isEmbedded}
      pageTitle={t('progressSaved.title')}
      title={t('progressSaved.title')}
    >
      <Container>
        <div className="max-w-[840px] mb-16">
          <H1
            className="mt-10 mb-6"
            variant="secondary"
            data-testid="section-title"
          >
            {t('progressSaved.title')}
          </H1>
          <H3 className="mb-4">{t('progressSaved.subtitle')}</H3>
          <Paragraph className="mb-2">
            {t('progressSaved.description')}
          </Paragraph>
          <Paragraph className="mb-6">
            {t('progressSaved.description2')}
          </Paragraph>
          <div className="flex flex-col justify-start gap-4 mt-4 md:flex-row">
            <Link
              className="mb-4 sm:mb-0 t-continue-to-main-site"
              href={{
                pathname: `/${language}/${tabName}`,
                query: {
                  isEmbedded: isEmbedded,
                  sessionId: isJsEnabled ? sessionIdFromContext : sessionId,
                },
              }}
              asButtonVariant="primary"
              target={isEmbedded ? '_blank' : undefined}
            >
              {t('progressSaved.primaryButtonLabel')}
            </Link>
            <Link
              className="mb-4 sm:mb-0 t-continue-to-main-site"
              href={{
                pathname: `/${language}/save`,
                query: {
                  isEmbedded: isEmbedded,
                  sessionId: isJsEnabled ? sessionIdFromContext : sessionId,
                  tabName: tabName,
                  email1: email1,
                  email2: email2,
                },
              }}
              asButtonVariant="secondary"
              target={isEmbedded ? '_blank' : undefined}
            >
              {t('progressSaved.secondaryButtonLabel')}
            </Link>
          </div>
        </div>
      </Container>
    </RetirementPlannerWrapper>
  );
};

export default ProgressSaved;
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const sessionId = query.sessionId as string | undefined,
    language = query.language as string | undefined,
    tabName = query.tabName as string | undefined;
  const email1 = query.email1 ? (query.email1 as string) : null;
  const email2 = query.email2 ? (query.email2 as string) : null;

  return {
    props: {
      sessionId: sessionId || null,
      isEmbedded: query?.isEmbedded === 'true' || false,
      language: language,

      tabName: tabName || null,
      email1,
      email2,
    },
  };
};
