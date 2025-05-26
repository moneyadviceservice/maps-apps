import {
  ChangeEvent,
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Button,
  Callout,
  CalloutVariant,
  Paragraph,
} from '@maps-react/common/index';
import SignUpOrg from 'components/SignUpOg/SignUpOrg';
import SignUpUser from 'components/SignUpUser/SignUpUser';
import Cookies from 'cookies';
import { allQuestions, FormType, signUpType } from 'data/form-data/org_signup';
import { userForm } from 'data/form-data/user_signup';
import { BasePageLayout } from 'layouts/BasePageLayout';
import { PageLayout } from 'layouts/PageLayout/PageLayout';
import { Entry } from 'lib/types';
import { GetServerSideProps } from 'next';
import { userSchema } from 'pages/api/sign-up-user';
import { PageError, PageTemplate } from 'types/@adobe/page';
import { SiteSettings } from 'types/@adobe/site-settings';
import { fetchPage, fetchSiteSettings } from 'utils/fetch';
import { getUrl } from 'utils/getUrl';

import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import { RadioButton } from '@maps-react/form/components/RadioButton';
import useTranslation from '@maps-react/hooks/useTranslation';

import { getStoreEntry } from '../../../utils/store';

type Props = {
  siteConfig: SiteSettings;
  assetPath: string;
  page: {
    pageTemplate: PageTemplate;
  };
  lang: string;
  url: string;
  entry: Entry;
  step: boolean;
};

interface FormModeContextProps {
  formMode: FormType | undefined;
  setFormMode: (val: FormType) => void;
}

const FormModeContext = createContext<FormModeContextProps | null>(null);

export const useFormMode = () => {
  const context = useContext(FormModeContext);
  if (!context)
    throw new Error('useFormMode must be used within a FormModeProvider');
  return context;
};

type FormTyeError = {
  newForm: Record<string, string[]>;
  existingForm: Record<string, string[]>;
};

const FormErrorSummary = ({
  formMode,
  activeErrors,
}: {
  formMode: FormType;
  activeErrors: FormTyeError;
}) => {
  const { z } = useTranslation();
  let errorSummaryErrors = {};
  if (formMode === FormType.NEW_ORG && activeErrors.newForm) {
    errorSummaryErrors = activeErrors.newForm;
  } else if (
    (formMode === FormType.ACTIVE_ORG || formMode === FormType.NEW_ORG_USER) &&
    activeErrors.existingForm
  ) {
    errorSummaryErrors = activeErrors.existingForm;
  }
  return (
    <ErrorSummary
      title={z({
        en: 'There is a problem',
        cy: 'Mae yna broblem',
      })}
      errors={errorSummaryErrors}
      errorKeyPrefix={''}
      classNames="mt-8 -mb-4"
    />
  );
};

const FormTypeSelector = ({
  flow,
  onChange,
}: {
  flow: FormType;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  const { z } = useTranslation();
  const input = signUpType(z);

  return (
    <fieldset className="relative">
      <legend className="mb-4 text-2xl text-gray-900">
        {z({
          en: 'Is your organisation a member of SFS?',
          cy: 'A yw eich sefydliad yn aelod o SFS?',
        })}
      </legend>
      {input.map((answer) => (
        <div key={`radio-${answer.text}`} className="mb-4">
          <RadioButton
            name="sfs-status"
            id={`${answer.value}`}
            value={answer.value}
            defaultChecked={flow === answer.value}
            classNameLabel="peer-checked:after:border-blue-600"
            onChange={onChange}
            hasError={false}
          >
            {answer.text}
          </RadioButton>
        </div>
      ))}
    </fieldset>
  );
};
export const ToggleFormProvider = ({
  entry,
  errors,
  assetPath,
  page,
  lang,
  url,
  step,
  children,
}: {
  entry: Entry;
  errors: Record<string, string[]>;
  assetPath: string;
  step: boolean;
  page: {
    pageTemplate: PageTemplate;
  };
  lang: string;
  url: string;
  children: ReactNode;
}) => {
  const flow = entry?.data?.flow ?? '';
  const [formMode, setFormMode] = useState<FormType | undefined>(undefined);
  const [activeErrors, setActiveErrors] = useState<FormTyeError>({
    newForm: errors,
    existingForm: {},
  });

  const [jsEnabled, setJsEnabled] = useState(false);

  const { z } = useTranslation();
  const contextValue = useMemo(
    () => ({
      formMode,
      setFormMode,
    }),
    [formMode],
  );

  useEffect(() => {
    setFormMode(step ? FormType.NEW_ORG_USER : (flow as FormType));
    setJsEnabled(true);
  }, [setFormMode, flow, errors, step]);

  return (
    <FormModeContext.Provider value={contextValue}>
      <PageLayout
        assetPath={assetPath}
        page={page.pageTemplate}
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
        {children}
        {jsEnabled && (
          <>
            {formMode !== FormType.NEW_ORG_USER && (
              <FormTypeSelector
                flow={formMode as FormType}
                onChange={(e) => {
                  setFormMode(e.target.value as FormType);
                }}
              />
            )}
            {formMode === FormType.NEW_ORG && ( // // {formType === FormType.ACTIVE_ORG && <SignUpUser />}
              <SignUpOrg entry={entry} lang={lang} />
            )}
            {(formMode === FormType.ACTIVE_ORG ||
              formMode === FormType.NEW_ORG_USER) && (
              <SignUpUser
                errors={activeErrors.existingForm}
                formType={formMode}
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const data = Object.fromEntries(formData.entries());

                  const result = userSchema.safeParse({
                    ...data,
                    orgLicenceNumber:
                      formMode === FormType.NEW_ORG_USER
                        ? 'new'
                        : data['orgLicenceNumber'],
                    codeOfConduct: data['codeOfConduct'] === 'true',
                  });

                  if (!result.success) {
                    const inputs = userForm(z, formMode);

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

                    document
                      .querySelector('[data-testid="error-summary-container"]')
                      ?.scrollIntoView({ behavior: 'smooth' });
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

const Page = ({
  siteConfig,
  assetPath,
  page,
  lang,
  url,
  entry,
  step,
}: Props) => {
  const { z } = useTranslation();

  const formData = allQuestions(z);

  const errors = entry?.errors?.reduce((acc, error) => {
    const field = formData.find((item) => item.name === error.field);

    return {
      ...acc,
      [error.field]: [`${field?.title} - ${field?.errors?.[error?.type]}`],
    };
  }, {} as Record<string, string[]>);

  return (
    <BasePageLayout
      siteConfig={siteConfig}
      assetPath={assetPath}
      pageTitle={page?.pageTemplate.title}
      breadcrumbs={page.pageTemplate.breadcrumbs}
      lang={lang}
      slug={[`/apply-to-use-the-sfs`]}
    >
      <ToggleFormProvider
        entry={entry}
        assetPath={assetPath}
        page={page}
        lang={lang}
        url={url}
        errors={errors}
        step={step}
      >
        <Callout
          variant={CalloutVariant.INFORMATION_BLUE}
          className="pb-10 mt-10 mb-8 lg:px-10"
        >
          <Paragraph>
            {z({
              en: 'Please check your organisation does not already have a current SFS Licence.',
              cy: 'Gwiriwch nad oes gan eich sefydliad Drwydded SFS gyfredol eisoes.',
            })}
          </Paragraph>
          <Button
            as="a"
            href={`${lang}/what-is-the-sfs/public-organisations`}
            className="bg-blue-600"
          >
            {z({
              en: 'Check License',
              cy: 'Gwiriwch yma',
            })}
          </Button>
        </Callout>
      </ToggleFormProvider>
    </BasePageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({
  params,
  query,
  req,
  res,
}) => {
  const lang = Array.isArray(params?.language)
    ? params.language[0]
    : params?.language ?? 'en';

  const slug = Array.isArray(params?.slug) ? params.slug : [];
  const siteConfig = await fetchSiteSettings(lang);
  const page = await fetchPage(lang, ['apply-to-use-the-sfs']);

  const cookies = new Cookies(req, res);
  const sessionId = cookies.get('fsid');
  const { entry } = await getStoreEntry(sessionId as string);

  if ((page as PageError).error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      siteConfig: siteConfig ?? {},
      assetPath: process.env.AEM_HOST_PUBLIC ?? '',
      lang: lang,
      slug: slug ?? [''],
      page: page,
      url: getUrl(req),
      entry: entry,
      step: !!query['user'] && entry?.errors?.length === 0,
    },
  };
};
