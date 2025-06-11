import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { useRouter } from 'next/router';

import {
  FormErrorSummary,
  FormTyeError,
} from 'components/FormErrorSummary/FormErrorSummary';
import { FormTypeSelector } from 'components/FormTypeSelector';
import { RichTextWrapper } from 'components/RichTextWrapper';
import SignUpOrg from 'components/SignUpOg/SignUpOrg';
import SignUpUser from 'components/SignUpUser/SignUpUser';
import { allQuestions, FormType } from 'data/form-data/org_signup';
import { userForm, userFormOTP } from 'data/form-data/user_signup';
import { PageLayout } from 'layouts/PageLayout/PageLayout';
import { Entry } from 'lib/types';
import { userSchema } from 'pages/api/sign-up-user';
import { PageTemplate } from 'types/@adobe/page';

import {
  Button,
  Callout,
  CalloutVariant,
  H2,
  Link,
  Paragraph,
} from '@maps-react/common/index';
import { ErrorField } from '@maps-react/form/types';
import useTranslation from '@maps-react/hooks/useTranslation';

const getErrors = (
  errors: ErrorField[],
  z: ReturnType<typeof useTranslation>['z'],
) => {
  const inputs = allQuestions(z);

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

interface FormModeContextProps {
  formMode: FormType | undefined;
  setFormMode: (val: FormType) => void;
}

type OrgSignupTypeSuccess = {
  orgName: string;
  isExisting: boolean;
};

const FormModeContext = createContext<FormModeContextProps | null>(null);

const scrollToError = () => {
  document
    .querySelector('[data-testid="error-summary-container"]')
    ?.scrollIntoView({ behavior: 'smooth' });
};

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
  const [formMode, setFormMode] = useState<FormType | undefined>(
    step ? FormType.NEW_ORG_USER : (flow as FormType),
  );
  const [showOTP, setShowOTP] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [entryData, setEntryData] = useState<Entry>(entry);
  const [activeErrors, setActiveErrors] = useState<FormTyeError>({
    newForm: getErrors(entry?.errors ?? [], z),
    existingForm: {},
  });

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

  const [continuationToken, setContinuationToken] = useState<string>();

  const router = useRouter();

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
            <CalloutMessage />
            {formMode !== FormType.NEW_ORG_USER && (
              <FormTypeSelector
                flow={formMode as FormType}
                onChange={(e) => {
                  setFormMode(e.target.value as FormType);
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
                      newForm: getErrors(result.entry.errors, z),
                      existingForm: activeErrors.existingForm,
                    });

                    scrollToError();

                    return;
                  }

                  setActiveErrors({
                    newForm: {},
                    existingForm: {},
                  });

                  setFormMode(FormType.NEW_ORG_USER);

                  router.push(
                    {
                      pathname: `/${lang}/apply-to-use-the-sfs`,
                      query: {
                        user: true,
                      },
                    },
                    undefined,
                    { scroll: true },
                  );
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
                    orgLicenceNumber:
                      formMode === FormType.NEW_ORG_USER
                        ? FormType.NEW_ORG_USER
                        : data['orgLicenceNumber'],
                    codeOfConduct: data['codeOfConduct'] === 'true',
                  };

                  const result = userSchema.safeParse(payload);

                  if (!result.success) {
                    const errors = result.error.issues.reduce((acc, issue) => {
                      const fieldName = issue.path[0] as string;
                      const type = issue.code;
                      if (!acc[fieldName]) {
                        const field = inputs.find(
                          (item) => item?.name === fieldName,
                        );
                        acc[fieldName] = [
                          `${field?.title} - ${field?.errors?.[type]}`,
                        ];
                      }
                      return acc;
                    }, {} as Record<string, string[]>);

                    setActiveErrors({
                      newForm: activeErrors.newForm,
                      existingForm: errors,
                    });

                    scrollToError();
                    setSubmitButtonDisabled(false);
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

                  if (signUpResponse.error) {
                    const input = [...inputs, ...userFormOTP(z, email)].find(
                      (item) => item?.name === signUpResponse.name,
                    );

                    let errors = {
                      unknown: [
                        z({
                          en: 'An unknown error occurred',
                          cy: 'Digwyddodd gwall anhysbys',
                        }),
                      ],
                    } as Record<string, string[]>;

                    if (signUpResponse.name) {
                      errors = {
                        [signUpResponse.name]: [
                          `${input?.title} - ${
                            input?.errors?.[signUpResponse.error]
                          }`,
                        ],
                      };
                    }

                    setActiveErrors({
                      newForm: {},
                      existingForm: errors,
                    });

                    scrollToError();
                    setSubmitButtonDisabled(false);
                    return;
                  }

                  if (signUpResponse.success) {
                    setExistingOrgSignup({
                      orgName: signUpResponse.organisationName,
                      isExisting: formMode === FormType.ACTIVE_ORG,
                    });
                    setFormMode(FormType.SUCCESS);
                  } else {
                    setEmailAddress(email);
                    setContinuationToken(signUpResponse.continuation_token);
                    setShowOTP(true);
                    setSubmitButtonDisabled(false);
                  }
                }}
              />
            )}
          </>
        )}
        {!jsEnabled && <div>enable js</div>}
      </PageLayout>
    </FormModeContext.Provider>
  );
};

const CalloutMessage = () => {
  const { z } = useTranslation();

  return (
    <Callout
      variant={CalloutVariant.INFORMATION_BLUE}
      className="pb-10 mt-10 mb-8 lg:px-10"
    >
      <Paragraph>
        {z({
          en: 'Please check your organisation does not already have a current SFS Licence',
          cy: 'Gwiriwch nad oes gan eich sefydliad Drwydded SFS gyfredol eisoes',
        })}
      </Paragraph>
      <Button
        as="a"
        href="/what-is-the-sfs/public-organisations"
        className="text-blue-600 bg-green-300"
      >
        {z({
          en: 'Check here',
          cy: 'Gwiriwch yma',
        })}
      </Button>
    </Callout>
  );
};

const CalloutSuccessMessage = ({ data }: { data: OrgSignupTypeSuccess }) => {
  const { z } = useTranslation();
  return (
    <Callout
      variant={CalloutVariant.INFORMATION_BLUE}
      className="pb-10 mt-10 mb-8 lg:px-10"
    >
      <RichTextWrapper className="mt-0 lg:mt-0">
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
                en: 'We will review the application in the next 10 working days. Once your application has been reviewed you will receive one of the following',
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
      </RichTextWrapper>
    </Callout>
  );
};
