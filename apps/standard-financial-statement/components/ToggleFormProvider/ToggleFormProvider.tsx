import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  FormErrorSummary,
  FormTyeError,
} from 'components/FormErrorSummary/FormErrorSummary';
import { FormTypeSelector } from 'components/FormTypeSelector';
import SignUpOrg from 'components/SignUpOg/SignUpOrg';
import SignUpUser from 'components/SignUpUser/SignUpUser';
import { allQuestions, FormType } from 'data/form-data/org_signup';
import { userForm } from 'data/form-data/user_signup';
import { PageLayout } from 'layouts/PageLayout/PageLayout';
import { Entry } from 'lib/types';
import { useRouter } from 'next/router';
import { userSchema } from 'pages/api/sign-up-user';
import { PageTemplate } from 'types/@adobe/page';

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
  children,
}: {
  entry: Entry;
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
  const { z } = useTranslation();
  const [formMode, setFormMode] = useState<FormType | undefined>(
    step ? FormType.NEW_ORG_USER : (flow as FormType),
  );
  const [showOTP, setShowOTP] = useState(false);
  const [entryData, setEntryData] = useState<Entry>(entry);
  const [activeErrors, setActiveErrors] = useState<FormTyeError>({
    newForm: getErrors(entry?.errors ?? [], z),
    existingForm: {},
  });

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
  }, [step, flow]);

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

                    document
                      .querySelector('[data-testid="error-summary-container"]')
                      ?.scrollIntoView({ behavior: 'smooth' });

                    return;
                  }

                  setActiveErrors({
                    newForm: {},
                    existingForm: {},
                  });

                  router.push(
                    {
                      pathname: `/${lang}/apply-to-use-the-sfs`,

                      query: {
                        user: true,
                      },
                      hash: 'sign-up-user-form',
                    },
                    undefined,
                    { scroll: false },
                  );
                }}
              />
            )}
            {(formMode === FormType.ACTIVE_ORG ||
              formMode === FormType.NEW_ORG_USER) && (
              <SignUpUser
                errors={activeErrors.existingForm}
                continuationToken={continuationToken ?? ''}
                formType={formMode}
                showOTP={showOTP}
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const data = Object.fromEntries(formData.entries());

                  const payload = {
                    ...data,
                    orgLicenceNumber:
                      formMode === FormType.NEW_ORG_USER
                        ? 'new'
                        : data['orgLicenceNumber'],
                    codeOfConduct: data['codeOfConduct'] === 'true',
                  };

                  const result = userSchema.safeParse(payload);

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

                    return;
                  }

                  setActiveErrors({
                    newForm: {},
                    existingForm: {},
                  });

                  const signUpResponse = await fetch(`/api/sign-up-user`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                  }).then((res) => res.json());

                  setShowOTP(true);

                  setContinuationToken(signUpResponse.continuation_token);
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
