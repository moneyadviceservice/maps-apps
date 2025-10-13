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
import { allQuestions, FormType, QuestionOrg } from 'data/form-data/org_signup';
import { userForm, userFormOTP } from 'data/form-data/user_signup';
import { PageLayout } from 'layouts/PageLayout/PageLayout';
import { Entry } from 'lib/types';
import { userSchema } from 'pages/api/sign-up-user';
import { twMerge } from 'tailwind-merge';
import { PageTemplate } from 'types/@adobe/page';
import { ZodError } from 'zod';

import { Button, H2, Link, Paragraph } from '@maps-react/common/index';
import { ErrorField } from '@maps-react/form/types';
import { AnalyticsData, useAnalytics } from '@maps-react/hooks/useAnalytics';
import useTranslation from '@maps-react/hooks/useTranslation';

export const getErrors = (inputs: QuestionOrg[], errors: ErrorField[]) => {
  return errors.reduce((acc, issue) => {
    const fieldName = issue.field;
    const type = issue.type;
    if (!acc[fieldName]) {
      const field = inputs.find(
        (item) => item?.name === fieldName || fieldName === `${item.name}Other`,
      );
      acc[fieldName] = [`${field?.title} - ${field?.errors?.[type]}`];
    }
    return acc;
  }, {} as Record<string, string[]>);
};

export const getUserErrors = (
  inputs: QuestionOrg[] | null[],
  error: ZodError,
) => {
  return error.issues.reduce((acc, issue) => {
    const fieldName = issue.path[0] as string;
    const isEmail =
      fieldName === 'emailAddress' &&
      (issue.message === 'not_allowed' ||
        issue.message === 'user_already_exists');
    const type = isEmail ? issue.message : issue.code;
    if (!acc[fieldName]) {
      const field = inputs.find((item) => item?.name === fieldName);
      acc[fieldName] = [`${field?.title} - ${field?.errors?.[type]}`];
    }
    return acc;
  }, {} as Record<string, string[]>);
};

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
    newForm: getErrors(allQuestions(z), entry?.errors ?? []),
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

  const handleErrors = useCallback(
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

  const [continuationToken, setContinuationToken] = useState<string>();

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
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const dataObject = Object.fromEntries(formData.entries());

                  const geo = formData.getAll('geoRegions');
                  const memberships = formData.getAll('memberships');

                  try {
                    const result = await fetch(`/fn/form-handler`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        ...dataObject,
                        geoRegions: geo.length ? geo : [],
                        memberships: memberships.length ? memberships : [],
                      }),
                    }).then((res) => res.json());

                    setEntryData({
                      data: result.entry.data,
                      errors: result.entry.errors ?? [],
                    });

                    if (result.entry.errors?.length) {
                      setActiveErrors({
                        newForm: getErrors(
                          allQuestions(z),
                          result.entry.errors,
                        ),
                        existingForm: activeErrors.existingForm,
                      });

                      scrollToError();

                      handleErrors(
                        getErrors(
                          allQuestions(enTranslation),
                          result.entry.errors,
                        ),
                      );

                      return;
                    }

                    setActiveErrors({
                      newForm: {},
                      existingForm: {},
                    });

                    setFormMode(FormType.NEW_ORG_USER);
                    trackForm(FormType.NEW_ORG_USER);

                    router.push(
                      {
                        pathname: `/${lang}/apply-to-use-the-sfs`,
                        query: {
                          user: true,
                        },
                        hash: 'sign-up-part-2',
                      },
                      undefined,
                      { scroll: false },
                    );
                  } catch (err) {
                    console.error('Error', err);
                  }
                }}
              />
            )}
            {(formMode === FormType.ACTIVE_ORG ||
              formMode === FormType.NEW_ORG_USER) && (
              <SignUpUser
                disabledCTA={submitButtonDisabled}
                errors={activeErrors.existingForm}
                continuationToken={continuationToken ?? ''}
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
                onSubmit={async (e) => {
                  e.preventDefault();
                  setSubmitButtonDisabled(true);
                  const formData = new FormData(e.currentTarget);
                  const data = Object.fromEntries(formData.entries());

                  const payload = {
                    ...data,
                    codeOfConduct: data['codeOfConduct'] === 'true',
                  };

                  const result = userSchema.safeParse(payload);

                  if (!result.success) {
                    const errors = getUserErrors(inputs, result.error);

                    const err = {
                      newForm: activeErrors.newForm,
                      existingForm: errors,
                    };

                    setActiveErrors(err);

                    scrollToError();
                    setSubmitButtonDisabled(false);
                    handleErrors(getUserErrors(inputsEn, result.error));
                    return;
                  }

                  setActiveErrors({
                    newForm: {},
                    existingForm: {},
                  });

                  const email = data['emailAddress'] as string;

                  const signUpResponse = await fetch(`/api/sign-up-user`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                  }).then((res) => res.json());

                  const getOtpErrors = (
                    z: ReturnType<typeof useTranslation>['z'],
                    error: { error: string; name: string },
                  ) => {
                    const input = [...inputs, ...userFormOTP(z, email)].find(
                      (item) => item?.name === signUpResponse.name,
                    );

                    if (error) {
                      return {
                        [error.name]: [
                          `${input?.title} - ${input?.errors?.[error.error]}`,
                        ],
                      };
                    }

                    return {
                      unknown: [
                        z({
                          en: 'An unknown error occurred',
                          cy: 'Digwyddodd gwall anhysbys',
                        }),
                      ],
                    };
                  };

                  if (signUpResponse.error) {
                    const errors = getOtpErrors(z, signUpResponse);

                    const err = {
                      newForm: {},
                      existingForm: errors,
                    };

                    setActiveErrors(err);
                    scrollToError();
                    setSubmitButtonDisabled(false);
                    handleErrors(getOtpErrors(enTranslation, signUpResponse));
                    return;
                  }

                  if (signUpResponse.success) {
                    setExistingOrgSignup({
                      orgName: signUpResponse.organisationName,
                      isExisting: formMode === FormType.ACTIVE_ORG,
                    });
                    setFormMode(FormType.SUCCESS);
                    trackForm(FormType.SUCCESS);
                  } else {
                    setEmailAddress(email);
                    setContinuationToken(signUpResponse.continuation_token);
                    setShowOTP(true);
                    setSubmitButtonDisabled(false);
                    trackForm(FormType.OTP);
                  }
                }}
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
