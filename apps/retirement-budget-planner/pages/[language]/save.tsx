import React, { useState } from 'react';

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import EmailInputField from 'components/SaveAndComeBack/EmailInputField';
import { useSessionId } from 'context/SessionContextProvider';
import RetirementPlannerWrapper from 'layout/RetirementPlannerWrapper/RetirementPlannerWrapper';
import { Partner } from 'lib/types/aboutYou';
import { findPartnerById } from 'lib/util/about-you';
import { getPartnersFromRedis } from 'lib/util/cacheToRedis';
import { validateEmails } from 'lib/validation/emailValidation';

import { Button } from '@maps-react/common/components/Button';
import { H1 } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';

type SaveAndComeBackPageProps = {
  isEmbedded: boolean;
  tabName?: string;
  sessionId?: string | null;
  partners: Partner[];
  language?: string;
  errorExist: boolean;
  email1?: string;
  email2?: string;
};

const SaveAndComeBackPage = ({
  isEmbedded = false,
  sessionId,
  partners,
  language,
  errorExist = false,
  email1,
  email2,
  tabName,
}: SaveAndComeBackPageProps) => {
  const [userEmail, setUserEmail] = useState<string | undefined>(email1);
  const [partnerEmail, setPartnerEmail] = useState<string | undefined>(email2);
  const [formErrors, setFormErrors] = useState<Record<string, string> | null>(
    null,
  );
  let errors = formErrors;
  const partner1 = findPartnerById(partners, 1);
  const partner2 = findPartnerById(partners, 2);
  const sessionIdFromContext = useSessionId();
  const router = useRouter();
  const { t } = useTranslation();
  if (errorExist) {
    const validationErrors = validateEmails(email1, email2);
    if (validationErrors) {
      errors = validationErrors;
    }
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateEmails(userEmail, partnerEmail);
    if (validationErrors) {
      setFormErrors(validationErrors);
      return;
    }
    setFormErrors(null);
    router.push({
      pathname: `/${language}/progress-saved`,
      query: {
        isEmbedded: isEmbedded,
        sessionId: sessionIdFromContext,
        tabName: tabName,
        language: language,
        email1: userEmail,
        email2: partnerEmail,
      },
    });
  };
  return (
    <RetirementPlannerWrapper
      isEmbedded={isEmbedded}
      pageTitle={t('saveAndComeBack.title')}
      title={t('saveAndComeBack.title')}
    >
      <Container>
        <div className="max-w-[840px] mb-16">
          <Link
            href={{
              pathname: `/${language}/${tabName}`,
              query: {
                isEmbedded: isEmbedded,
                sessionId: sessionId ?? sessionIdFromContext,
              },
            }}
          >
            <Icon type={IconType.CHEVRON_LEFT} />
            {t('saveAndComeBack.backButtonLink')}
          </Link>
          <H1
            className="mt-10 mb-6"
            variant="secondary"
            data-testid="section-title"
          >
            {t('saveAndComeBack.title')}
          </H1>
          <Paragraph>{t('saveAndComeBack.description')}</Paragraph>

          <form method="POST" noValidate>
            <input type="HIDDEN" name="language" defaultValue={language} />

            {partner1 && (
              <EmailInputField
                partnerId={partner1.id}
                emailValue={userEmail || email1}
                formErrors={formErrors || errors}
                onChange={(value) => setUserEmail(value)}
              />
            )}
            {partner2 && (
              <EmailInputField
                partnerId={partner2.id}
                emailValue={partnerEmail || email2}
                formErrors={formErrors || errors}
                onChange={(value) => setPartnerEmail(value)}
              />
            )}

            <Button
              className="w-full mt-6 md:w-auto"
              onClick={handleSubmit}
              formAction={`/api/save-and-return?sessionId=${sessionId}`}
              data-testid="save-and-return"
            >
              {t('saveAndComeBack.buttonLabel')}
            </Button>
          </form>
        </div>
      </Container>
    </RetirementPlannerWrapper>
  );
};

export default SaveAndComeBackPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const sessionId = query.sessionId as string | undefined,
    language = query.language as string | undefined,
    tabName = query.tabName as string | undefined;
  const errorExist = query.error === 'true';
  const email1 = query.email1 ? (query.email1 as string) : null;
  const email2 = query.email2 ? (query.email2 as string) : null;
  let partners = [];
  if (sessionId) partners = await getPartnersFromRedis(sessionId);
  return {
    props: {
      partners,
      sessionId: sessionId || null,
      isEmbedded: query?.isEmbedded === 'true' || false,
      language: language,
      errorExist: errorExist,
      tabName: tabName || null,
      email1,
      email2,
    },
  };
};
