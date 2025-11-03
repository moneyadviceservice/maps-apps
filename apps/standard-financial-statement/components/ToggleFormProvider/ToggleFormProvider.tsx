import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useRouter } from 'next/router';

import CalloutMessage from 'components/CalloutMessage/CalloutMessage';
import {
  FormErrorSummary,
  FormTyeError,
} from 'components/FormErrorSummary/FormErrorSummary';
import { FormTypeSelector } from 'components/FormTypeSelector';
import { buttonStyles } from 'components/RichTextWrapper';
import SignUpOrg from 'components/SignUpOg/SignUpOrg';
import SignUpUser from 'components/SignUpUser/SignUpUser';
import { allQuestions, FormType } from 'data/form-data/org_signup';
import { userForm } from 'data/form-data/user_signup';
import { PageLayout } from 'layouts/PageLayout/PageLayout';
import { Entry, FormError } from 'lib/types';
import { twMerge } from 'tailwind-merge';
import { PageTemplate } from 'types/@adobe/page';
import { submitOrg } from 'utils/signup/submitOrg';
import { submitUser } from 'utils/signup/submitUser';
import { getOrgErrors } from 'utils/signup/validation/getOrgErrors';
import { getOtpErrors } from 'utils/signup/validation/getOtpErrors';
import { getUserErrors } from 'utils/signup/validation/getUserErrors';
import { ZodError } from 'zod';

import { Button, H2, Link, Paragraph } from '@maps-react/common/index';
import { AnalyticsData, useAnalytics } from '@maps-react/hooks/useAnalytics';
import useTranslation from '@maps-react/hooks/useTranslation';

export const scrollToError = () => {
  const errorContainer: HTMLElement | null = document.getElementById(
    'error-summary-container',
  );
  errorContainer?.focus();
  errorContainer?.scrollIntoView({ behavior: 'smooth' });
};

interface FormModeContextProps {
  formMode: FormType | undefined;
  setFormMode: (val: FormType) => void;
}

type OrgSignupTypeSuccess = {
  orgName: string;
  isExisting: boolean;
};

const FormModeContext = createContext<FormModeContextProps | null>(null);

export const useFormMode = () => {
  const context = useContext(FormModeContext);
  if (!context)
    throw new Error('useFormMode must be used within a FormModeProvider');
  return context;
};

export const ToggleFormProvider = ({
  entry,
  assetPath,
  page,
  lang,
  url,
  step,
}: {
  entry: Entry;
  assetPath: string;
  step: boolean;
  page: {
    pageTemplate: PageTemplate;
  };
  lang: string;
  url: string;
}) => {
  const flow = entry?.data?.flow ?? '';
  const { z } = useTranslation();
  const router = useRouter();
  const { z: enTranslation } = useTranslation('en');
  const [formMode, setFormMode] = useState<FormType | undefined>(
    step ? FormType.NEW_ORG_USER : (flow as FormType),
  );
  const [showOTP, setShowOTP] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [entryData, setEntryData] = useState<Entry>(entry);
  const [activeErrors, setActiveErrors] = useState<FormTyeError>({
    newForm: getOrgErrors(allQuestions(z), entry?.errors ?? []),
    existingForm: {},
  });

  const [formFlowType, setFormFlowType] = useState<FormType | undefined>();

  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [existingOrgSignup, setExistingOrgSignup] =
    useState<OrgSignupTypeSuccess>({
      orgName: '',
      isExisting: false,
    });

  const inputs = useMemo(
    () => userForm(z, formMode as FormType),
    [z, formMode],
  );

  const inputsEn = useMemo(
    () => userForm(enTranslation, formMode as FormType),
    [formMode, enTranslation],
  );

  const { addEvent } = useAnalytics();

  const trackErrors = useCallback(
    (errors: Record<string, string[]>) => {
      addEvent({
        event: 'errorMessage',
        eventInfo: {
          toolName: '',
          toolStep: '',
          stepName: '',
          errorDetails: [
            ...Object.entries(errors).map(([field, messages]) => ({
              reactCompType: 'FormField',
              reactCompName: field,
              errorMessage: messages[0].split(' - ').pop()?.trim(),
            })),
          ],
        },
      } as AnalyticsData);
    },
    [addEvent],
  );

  const trackForm = useCallback(
    (form: FormType) => {
      const signUpType = form === FormType.NEW_ORG ? 'New Org' : 'Active Org';
      if (
        (form === FormType.NEW_ORG || form === FormType.ACTIVE_ORG) &&
        !router.query.user
      ) {
        addEvent({
          event: 'Start',
          eventInfo: {
            stepName: `sfs-application-form`,
            reactCompName: `SFS Application Form ${signUpType}`,
          },
        });

        setFormFlowType(form);
      }

      if (form === FormType.NEW_ORG || form === FormType.NEW_ORG_USER) {
        addEvent({
          event: 'formStarted',
          eventInfo: {
            stepName: `in-progress-Part-${form === FormType.NEW_ORG ? 1 : 2}`,
            reactCompName: `SFS Application Form ${signUpType}`,
          },
        });
      }

      if (form === FormType.ACTIVE_ORG) {
        addEvent({
          event: 'formStarted',
          eventInfo: {
            stepName: `in-progress-Part-1`,
            reactCompName: `SFS Application Form ${signUpType}`,
          },
        });
      }

      if (form === FormType.OTP) {
        addEvent({
          event: 'formStarted',
          eventInfo: {
            stepName: `in-progress-Part-${
              formFlowType === FormType.NEW_ORG ? 3 : 2
            }`,
            reactCompName: `SFS Application Form ${signUpType}`,
          },
        });
      }

      if (form === FormType.SUCCESS) {
        addEvent({
          event: 'formSubmitted',
          eventInfo: {
            stepName: `Complete`,
            reactCompName: `SFS Application Form ${signUpType}`,
          },
        });
      }
    },
    [addEvent, formFlowType, router.query.user],
  );

  const [jsEnabled, setJsEnabled] = useState(false);

  const contextValue = useMemo(
    () => ({
      formMode,
      setFormMode,
    }),
    [formMode],
  );

  useEffect(() => {
    setJsEnabled(true);
    setFormMode(step ? FormType.NEW_ORG_USER : (flow as FormType));
    setActiveErrors({
      newForm: {},
      existingForm: {},
    });
  }, [step, flow]);

  const handleOrgErrors = (errors: FormError[]) => {
    setEntryData({
      ...entryData,
      errors: errors,
    });

    setActiveErrors({
      newForm: getOrgErrors(allQuestions(z), errors),
      existingForm: activeErrors.existingForm,
    });

    scrollToError();

    trackErrors(getOrgErrors(allQuestions(enTranslation), errors));
  };

  const handleUserErrors = (errors: ZodError<unknown>) => {
    setActiveErrors({
      newForm: activeErrors.newForm,
      existingForm: getUserErrors(inputs, errors),
    });
    scrollToError();
    setSubmitButtonDisabled(false);
    trackErrors(getUserErrors(inputsEn, errors));
  };

  const handleOtpErrors = (
    response: { error: string; name: string },
    email: string,
  ) => {
    const errors = getOtpErrors(z, response, inputs, email);
    setActiveErrors({
      newForm: {},
      existingForm: errors as Record<string, string[]>,
    });
    setSubmitButtonDisabled(false);
    trackErrors(
      getOtpErrors(enTranslation, response, inputs, email) as Record<
        string,
        string[]
      >,
    );
    if (response.name === 'password') {
      setShowOTP(false);
    }
    scrollToError();
  };

  const resetFormErrors = () => {
    setEntryData({
      ...entryData,
      errors: [],
    });

    setActiveErrors({
      newForm: {},
      existingForm: {},
    });
  };

  const switchFormType = (form: FormType) => {
    form !== FormType.OTP && setFormMode(form);
    trackForm(form);
  };

  return (
    <FormModeContext.Provider value={contextValue}>
      <PageLayout
        assetPath={assetPath}
        page={{
          ...page.pageTemplate,
          content:
            formMode === FormType.SUCCESS ? [] : page.pageTemplate.content,
        }}
        lang={lang}
        slug={[`/apply-to-use-the-sfs`]}
        url={url}
        topInfo={
          jsEnabled && (
            <FormErrorSummary
              formMode={formMode as FormType}
              activeErrors={activeErrors}
            />
          )
        }
      >
        {jsEnabled && formMode === FormType.SUCCESS && (
          <CalloutSuccessMessage data={existingOrgSignup} />
        )}

        {jsEnabled && formMode !== FormType.SUCCESS && (
          <>
            <CalloutApplyMessage />
            {formMode !== FormType.NEW_ORG_USER && (
              <FormTypeSelector
                flow={formMode as FormType}
                onChange={(e) => {
                  const formSelected = e.target.value as FormType;
                  setFormMode(formSelected);
                  trackForm(formSelected);
                }}
              />
            )}
            {formMode === FormType.NEW_ORG && (
              <SignUpOrg
                entry={entryData}
                lang={lang}
                onSubmit={(e) => {
                  submitOrg({
                    e,
                    lang,
                    router,
                    handleErrors: handleOrgErrors,
                    resetErrors: resetFormErrors,
                    switchFormType,
                  });
                }}
              />
            )}
            {(formMode === FormType.ACTIVE_ORG ||
              formMode === FormType.NEW_ORG_USER) && (
              <SignUpUser
                disabledCTA={submitButtonDisabled}
                errors={activeErrors.existingForm}
                formType={formMode}
                showOTP={showOTP}
                emailAddress={emailAddress ?? ''}
                onChange={(e) => {
                  if (
                    e.target.name === 'emailAddress' &&
                    showOTP &&
                    emailAddress !== e.target.value
                  ) {
                    setShowOTP(false);
                  }
                }}
                onSubmit={(e) =>
                  submitUser({
                    e,
                    formMode,
                    setSubmitButtonDisabled,
                    setExistingOrgSignup,
                    setEmailAddress,
                    setShowOTP,
                    switchFormType,
                    handleUserErrors,
                    handleOtpErrors,
                    resetFormErrors,
                  })
                }
              />
            )}
          </>
        )}
        {!jsEnabled && <CalloutNoJs />}
      </PageLayout>
    </FormModeContext.Provider>
  );
};

export const CalloutNoJs = () => {
  const { z } = useTranslation();

  return (
    <CalloutMessage>
      <H2 className="mb-4 md:text-4xl leading-1">
        {z({
          en: 'Javascript required to Sign in and view content',
          cy: 'Mae angen Javascript i fewngofnodi a gweld cynnwys',
        })}
      </H2>
      <Paragraph>
        {z({
          en: 'This page contains gated resources that require login through our secure authentication system. JavaScript is necessary to access the login interface and complete the authentication process.',
          cy: `Mae'r dudalen hon yn cynnwys adnoddau wedi'u cyfyngu sy'n gofyn am fewngofnodi trwy ein system ddilysu ddiogel. Mae angen JavaScript i gael mynediad at y rhyngwyneb mewngofnodi a chwblhau'r broses ddilysu.`,
        })}
      </Paragraph>
      <Paragraph>
        {z({
          en: 'To continue, enable JavaScript in your browser settings (usually found under Privacy/Security or Site Settings), then refresh this page. The ‘Sign in’ button will appear, allowing you to access this content.',
          cy: `I barhau, galluogwch JavaScript yng ngosodiadau eich porwr (gallwch fel arfer dod o hyd i hwn o dan Breifatrwydd/Diogelwch neu Osodiadau Safle), yna adnewyddwch y dudalen hon. Bydd y botwm 'Mewngofnodi' yn ymddangos, gan ganiatáu i chi gael mynediad at y cynnwys hwn.`,
        })}
      </Paragraph>
      <Paragraph>
        {z({
          en: (
            <>
              If you are unable to enable JavaScript, please contact us at{' '}
              <Link
                href="mailto:sfs.support@maps.org.uk"
                className="text-blue-600 underline"
              >
                sfs.support@maps.org.uk
              </Link>
            </>
          ),
          cy: (
            <>
              Os na allwch alluogi JavaScript, cysylltwch â ni ar{' '}
              <Link
                href="mailto:sfs.support@maps.org.uk"
                className="text-blue-600 underline"
              >
                sfs.support@maps.org.uk
              </Link>
            </>
          ),
        })}
      </Paragraph>
    </CalloutMessage>
  );
};

const CalloutApplyMessage = () => {
  const { z } = useTranslation();

  return (
    <CalloutMessage>
      <Paragraph>
        {z({
          en: 'Please check your organisation does not already have a current SFS Licence',
          cy: 'Gwiriwch nad oes gan eich sefydliad Drwydded SFS gyfredol eisoes',
        })}
      </Paragraph>
      <Button
        as="a"
        href="/what-is-the-sfs/public-organisations"
        className={twMerge('mt-4', ...buttonStyles)}
      >
        {z({
          en: 'Check here',
          cy: 'Gwiriwch yma',
        })}
      </Button>
    </CalloutMessage>
  );
};

const CalloutSuccessMessage = ({ data }: { data: OrgSignupTypeSuccess }) => {
  const { z } = useTranslation();
  return (
    <CalloutMessage>
      <H2 className="mb-4 md:text-4xl">
        {z({
          en: 'Thank you for your application',
          cy: 'Diolch am eich cais',
        })}
      </H2>

      {data.isExisting && (
        <Paragraph>
          {z({
            en: `Your application for an SFS user account for ${data.orgName} has been successfully approved. Use your login details to access the Use The SFS area of the website.`,
            cy: `Mae eich cais am gyfrif defnyddiwr SFS ar gyfer ${data.orgName} wedi’i gymeradwyo’n llwyddiannus. Defnyddiwch eich manylion mewngofnodi i gyrchu adran ‘Defnyddio’r SFS’ y wefan.`,
          })}
        </Paragraph>
      )}

      {!data.isExisting && (
        <>
          <Paragraph>
            {z({
              en: 'We will review the application in the next 10 working days. Once your application has been reviewed you will receive one of the following:',
              cy: `Byddwn yn adolygu'r cais yn ystod y 10 diwrnod gwaith nesaf. Ar ôl i'ch cais gael ei adolygu, byddwch yn derbyn un o'r canlynol:`,
            })}
          </Paragraph>
          <ul className="list-disc">
            <li>
              {z({
                en: 'An email confirming that your application was successful. This email will also include your SFS Membership Number',
                cy: 'E-bost yn cadarnhau bod eich cais wedi bod yn llwyddiannus. Bydd yr e-bost hwn hefyd yn cynnwys eich Rhif Aelodaeth SFS',
              })}
            </li>
            <li>
              {z({
                en: 'An email request for additional information',
                cy: 'Cais am wybodaeth ychwanegol drwy e-bost',
              })}
            </li>
            <li>
              {z({
                en: 'An email confirming rejection of application',
                cy: 'E-bost yn cadarnhau gwrthod y cais',
              })}
            </li>
          </ul>
          <Paragraph>
            {z({
              en: (
                <>
                  If you have any questions, please contact us at{' '}
                  <Link
                    href="mailto:sfs.support@maps.org.uk"
                    className="text-blue-600 underline"
                  >
                    sfs.support@maps.org.uk
                  </Link>
                </>
              ),
              cy: (
                <>
                  Os oes gennych unrhyw gwestiynau, cysylltwch â ni ar{' '}
                  <Link
                    href="mailto:sfs.support@maps.org.uk"
                    className="text-blue-600 underline"
                  >
                    sfs.support@maps.org.uk
                  </Link>
                </>
              ),
            })}
          </Paragraph>
        </>
      )}
    </CalloutMessage>
  );
};
