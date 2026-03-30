import React, { useState } from 'react';

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import EmailInputField from 'components/SaveAndComeBack/EmailInputField';
import { useSessionId } from 'context/SessionContextProvider';
import RetirementPlannerWrapper from 'layout/RetirementPlannerWrapper/RetirementPlannerWrapper';
import { ERROR_TYPES } from 'lib/constants/constants';
import { getPartnersFromRedis } from 'lib/util/cacheToRedis';

import { Button } from '@maps-react/common/components/Button';
import { H1 } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Container } from '@maps-react/core/components/Container';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import { useTranslation } from '@maps-react/hooks/useTranslation';

type SaveAndComeBackPageProps = {
  isEmbedded: boolean;
  stepsEnabled: string;
  tabName: string;
  sessionId?: string | null;
  language?: string;
  errors?: Record<string, string>;
};

const SaveAndComeBackPage = ({
  isEmbedded = false,
  sessionId,
  language,
  errors,
  tabName,
  stepsEnabled,
}: SaveAndComeBackPageProps) => {
  const [userEmail, setUserEmail] = useState<string | undefined>('');
  const [formErrors, setFormErrors] = useState<Record<string, string> | null>(
    errors || null,
  );

  const sessionIdFromContext = useSessionId();
  const router = useRouter();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams({
      tabName: tabName || '',
      stepsEnabled: stepsEnabled,
    });

    try {
      const response = await fetch(`/api/save-and-return?${params}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          sessionId,
          language,
          isJSon: true,
        }),
      });

      if (response.status === 200) {
        router.push({
          pathname: `/${language}/progress-saved`,
          query: {
            isEmbedded: isEmbedded,
            sessionId: sessionIdFromContext,
            tabName: tabName,
            stepsEnabled,
          },
        });
      } else {
        const errors = await response.json();

        if (
          errors &&
          Object.values(errors.type).every((t) => t === ERROR_TYPES.EMAIL)
        )
          setFormErrors(errors.type);
        else {
          router.push({
            pathname: `/${language}/error-page`,
            query: {
              isEmbedded: isEmbedded,
            },
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <RetirementPlannerWrapper
      isEmbedded={isEmbedded}
      pageTitle={t('saveAndComeBack.title')}
      title={t('saveAndComeBack.title')}
    >
      <Container>
        <div className="max-w-[840px] mb-16 space-y-8">
          <Link
            href={{
              pathname: `/${language}/${tabName}`,
              query: {
                isEmbedded: isEmbedded,
                sessionId: sessionId ?? sessionIdFromContext,
                stepsEnabled: stepsEnabled,
              },
            }}
          >
            <Icon type={IconType.CHEVRON_LEFT} />
            {t('saveAndComeBack.backButtonLink')}
          </Link>
          <ErrorSummary
            title={t('saveAndComeBack.errorSummary.title')}
            errors={
              formErrors
                ? Object.fromEntries(
                    Object.entries(formErrors).map(([key, value]) => {
                      if (key.includes('email'))
                        return [
                          key,
                          [t(`saveAndComeBack.errorSummary.${value}`)],
                        ];
                      return [key, ''];
                    }),
                  )
                : {}
            }
          ></ErrorSummary>
          <H1
            className="mt-10 mb-6"
            variant="secondary"
            data-testid="section-title"
          >
            {t('saveAndComeBack.title')}
          </H1>

          <form method="POST" noValidate>
            <Paragraph>{t('saveAndComeBack.description')}</Paragraph>
            <input type="HIDDEN" name="language" defaultValue={language} />
            <input type="hidden" name="sessionId" value={sessionId ?? ''} />

            <EmailInputField
              emailValue={userEmail}
              formErrors={formErrors}
              onChange={(value) => setUserEmail(value)}
            />

            <Button
              className="w-full mt-6 md:w-auto"
              onClick={handleSubmit}
              formAction={`/api/save-and-return`}
              data-testid="save-and-return"
              disabled={formErrors?.error === ERROR_TYPES.SESSION_EXPIRED}
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

export const getServerSideProps: GetServerSideProps<
  SaveAndComeBackPageProps
> = async (context) => {
  const { query } = context;

  const sessionId = query.sessionId as string | undefined,
    language = query.language as string | undefined,
    tabName = query.tabName as string | undefined,
    error = query.error as string | undefined;

  let errors = {};
  if (error) {
    if (error?.includes(',')) {
      const errorToArray = error?.split(',');
      for (const item of errorToArray) {
        errors = { ...errors, [item]: ERROR_TYPES.EMAIL };
      }
    } else if (error?.includes('email')) {
      errors = { [error]: ERROR_TYPES.EMAIL };
    } else errors = { error: error };
  }

  let partner = {};
  if (sessionId) partner = await getPartnersFromRedis(sessionId);
  return {
    props: {
      partner: Array.isArray(partner) ? partner[0] : partner,
      sessionId: sessionId || null,
      isEmbedded: query?.isEmbedded === 'true' || false,
      language: language,
      errors: errors,
      tabName: tabName || '',
      stepsEnabled: query?.stepsEnabled as string,
    },
  };
};
