import {
  Paragraph,
  Container,
  Button,
  Heading,
  Link,
  UrgentCallout,
} from '@maps-digital/shared/ui';
import { DataPath } from 'types';
import { DataFromQuery } from 'utils/pageFilter';
import {
  stepData,
  validatePensionInputs,
} from 'data/workplace-pension-calculator';
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { PensionCalculatorDetails } from './PensionCalculatorDetails';
import { PensionCalculatorContributions } from './PensionCalculatorContributions';
import { PensionCalculatorResults } from './PensionCalculatorResults';
import { useTranslation } from '@maps-digital/shared/hooks';
import {
  PensionInput,
  StepName,
  pageData,
} from 'data/workplace-pension-calculator/pension-data';
import { useRouter } from 'next/router';
import {
  navigationRules,
  queryStringFormat,
} from 'pages/api/pensions-calculator';
import {
  ContributionCalculatorResults,
  ContributionType,
} from 'utils/PensionCalculator/contributionCalculator';
import {
  ErrorObject,
  validateContributions,
} from 'data/workplace-pension-calculator/pension-validation';
import { addEmbedQuery } from 'utils/addEmbedQuery';
import { useAnalytics } from 'hooks/useAnalytics';
import { workplacePensionCalculatorAnalytics as analyticsData } from 'data/form-content/analytics';
export type Props = {
  lang: string;
  data?: string;
  action?: string;
  dataPath?: DataPath;
  isEmbed?: boolean;
  queryData: DataFromQuery;
  currentStep: StepName;
  results: ContributionCalculatorResults;
  errors: ErrorObject;
};

export type ErrorField = {
  field: string;
  type: string;
  message?: string;
};

export const PensionCalculator = ({
  lang,
  data,
  action,
  dataPath,
  isEmbed,
  queryData,
  currentStep,
  results,
  errors,
}: Props) => {
  delete queryData['currentStep'];
  const newQuery = queryStringFormat(queryData);
  const currentStepGA = useRef<StepName>();

  const { addEvent } = useAnalytics();

  const ref = useRef<HTMLInputElement>(null);
  const [clientErrors, setClientErrors] = useState({});
  const [cachedQuery, setCachedQuery] = useState({} as DataFromQuery);
  const router = useRouter();

  const { z } = useTranslation();

  const steps = useMemo(() => stepData(z), [z]);
  const page = useMemo(() => pageData(z), [z]);
  const step = useMemo(() => steps[currentStep], [steps, currentStep]);

  useEffect(() => {
    const fireEvent = () => {
      addEvent({
        page: {
          pageName: analyticsData?.pageName,
          pageTitle: analyticsData?.pageTitle,
        },
        tool: {
          toolName: analyticsData?.toolName,
          toolStep: step.stepNumber,
          stepName: step.title,
        },
        event: 'toolStep',
      });
      currentStepGA.current = currentStep;
    };

    if (currentStepGA.current !== currentStep) {
      fireEvent();
    }

    const beforeHistoryChange = () => {
      if (currentStep === StepName.CONTRIBUTIONS) {
        clearErrors();
      }
    };

    router.events.on('beforeHistoryChange', beforeHistoryChange);

    return () => {
      router.events.off('beforeHistoryChange', beforeHistoryChange);
    };
  }, [
    addEvent,
    step,
    steps,
    page,
    clientErrors,
    router,
    setClientErrors,
    currentStep,
  ]);

  const getFormValues = (form: HTMLFormElement) => {
    const elements = form.elements;
    if (currentStep === StepName.DETAILS) {
      return {
        age: (elements.namedItem(PensionInput.AGE) as HTMLInputElement)?.value,
        salary: (elements.namedItem(PensionInput.SALARY) as HTMLInputElement)
          ?.value,
        frequency: (
          elements.namedItem(PensionInput.FREQUENCY) as HTMLInputElement
        )?.value,
        contributionType: (
          elements.namedItem(PensionInput.CONTRIBUTION_TYPE) as HTMLInputElement
        )?.value as ContributionType,
      };
    }
    if (currentStep === StepName.CONTRIBUTIONS) {
      return {
        employeeContribution: (
          elements.namedItem(
            PensionInput.EMPLOYEE_CONTRIBUTION,
          ) as HTMLInputElement
        ).value,
        employerContribution: (
          elements.namedItem(
            PensionInput.EMPLOYER_CONTRIBUTION,
          ) as HTMLInputElement
        ).value,
      };
    }

    return {};
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement | HTMLSelectElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const q = getFormValues(form);
    const errors = validatePensionInputs(q);

    if (Object.keys(errors).length) {
      e.preventDefault();
      setClientErrors(errors);
      form
        .querySelector('[data-testid="errors"]')
        ?.scrollIntoView({ behavior: 'smooth' });

      return;
    }
    if (ref.current) ref.current.blur();
    const stepName = navigationRules(currentStep, errors);
    delete router.query['reset'];
    delete cachedQuery['currentStep'];

    const prevURL = `/${lang}/${dataPath}/calculator?currentStep=${currentStep}&${queryStringFormat(
      {
        ...cachedQuery,
        ...queryData,
        ...(q as Record<string, string>),
      },
    )}${addEmbedQuery(!!isEmbed, '?')}`;

    router.replace(prevURL, undefined, { shallow: true });

    router.push(
      {
        pathname: router.route,
        query: {
          ...cachedQuery,
          ...router.query,
          ...q,
          currentStep: stepName,
        },
        hash: 'top',
      },
      undefined,
      { scroll: false },
    );

    setCachedQuery({
      ...router.query,
      ...q,
    });
  };

  const handleContributions = (e: ChangeEvent<HTMLInputElement>) => {
    const form = e.target.form as HTMLFormElement;
    const elements = form.elements;
    const errors = validateContributions(
      queryData.salary,
      queryData.frequency,
      (
        elements.namedItem(
          PensionInput.EMPLOYEE_CONTRIBUTION,
        ) as HTMLInputElement
      ).value,
      (
        elements.namedItem(
          PensionInput.EMPLOYER_CONTRIBUTION,
        ) as HTMLInputElement
      ).value,
      {},
    );
    setClientErrors(errors);
  };

  const clearErrors = () => {
    setClientErrors({});
    const submit = document.getElementById('submit');
    submit?.removeAttribute('disabled');
  };

  const handleEdit = (
    e: React.MouseEvent<HTMLAnchorElement>,
    step: StepName,
  ) => {
    e.preventDefault();
    clearErrors();
    router.push(
      {
        pathname: router.route,
        query: { ...router.query, currentStep: step },
        hash: 'top',
      },
      undefined,
      { scroll: false },
    );
  };

  const getEditPath = (step: StepName) => {
    return `/${lang}/${dataPath}/calculator?${newQuery}&currentStep=${step}${addEmbedQuery(
      !!isEmbed,
      '?',
    )}#top`;
  };

  return (
    <Container className="lg:container-auto pt-4 pb-1.5 lg:max-w-[960px]">
      <div className="pb-7 flex flex-col" data-testid="pension-calculator">
        <form onSubmit={(e) => handleSubmit(e)} method="POST" noValidate>
          <input
            type="hidden"
            name="isEmbed"
            value={isEmbed ? 'true' : 'false'}
          />
          <input type="hidden" name="language" value={lang} />
          <input type="hidden" name="savedData" value={data} />
          <input type="hidden" name="dataPath" value={dataPath} />
          <input type="hidden" name="currentStep" value={currentStep} />
          <div className="lg:max-w-[960px]">
            <Paragraph className="-mt-6 mb-6 md:text-2xl print:hidden text-gray-400">
              {page.description}
            </Paragraph>

            <PensionCalculatorDetails
              queryData={queryData}
              step={steps[StepName.DETAILS]}
              editPath={getEditPath(StepName.DETAILS)}
              onEdit={(e) => handleEdit(e, StepName.DETAILS)}
              stepCompleted={step.stepNumber > 1}
              errors={Object.keys(clientErrors).length ? clientErrors : errors}
            />
            {step.stepNumber >= 2 && (
              <PensionCalculatorContributions
                queryData={queryData}
                step={steps[StepName.CONTRIBUTIONS]}
                errors={
                  Object.keys(clientErrors).length ? clientErrors : errors
                }
                editPath={getEditPath(StepName.CONTRIBUTIONS)}
                stepCompleted={step.stepNumber >= 3}
                onEdit={(e) => handleEdit(e, StepName.CONTRIBUTIONS)}
                onChange={(e) =>
                  handleContributions(e as ChangeEvent<HTMLInputElement>)
                }
              />
            )}
            {step.stepNumber >= 3 && (
              <PensionCalculatorResults
                queryData={queryData}
                step={steps[StepName.RESULTS]}
                results={results}
                resetPath={`/${lang}/${dataPath}/calculator?reset=true${addEmbedQuery(
                  !!isEmbed,
                  '?',
                )}#top`}
              />
            )}
          </div>
          {step.stepNumber < 3 && (
            <Button
              ref={ref}
              name="submit"
              className="mt-4"
              variant="primary"
              formAction={action}
              id="submit"
            >
              {step.buttonText}
            </Button>
          )}
        </form>
      </div>
      <UrgentCalloutMessage lang={lang} />
    </Container>
  );
};

export const UrgentCalloutMessage = ({ lang }: { lang: string }) => {
  const { z } = useTranslation();

  return (
    <UrgentCallout variant="arrow" className="print:hidden mt-12">
      <Heading level="h3" className="font-semibold mb-6">
        {z({
          en: 'Need more information on pensions?',
          cy: 'Angen mwy o wybodaeth am bensiynau?',
        })}
      </Heading>
      <Paragraph>
        {z({
          en: 'Call our helpline free on',
          cy: `Ffoniwch ni am ddim ar`,
        })}{' '}
        <Link href="tel:08000113797">0800 011 3797</Link>{' '}
        {z({
          en: 'or',
          cy: `neu`,
        })}{' '}
        <Link
          href={`https://www.moneyhelper.org.uk/${
            lang === 'en' ? 'PensionsChat' : 'welshchat'
          }`}
        >
          {z({
            en: 'use our webchat.',
            cy: `defnyddiwch ein gwe-sgwrsYn.`,
          })}
        </Link>{' '}
        {z({
          en: 'One of our pension specialists will be happy to answer your questions.',
          cy: `Bydd un o’n harbenigwyr pensiwn yn hapus i ateb eich cwestiynau.`,
        })}
      </Paragraph>

      <Paragraph>
        {z({
          en: 'Our help is impartial and free to use, whether that’s online or over the phone.',
          cy: `Mae ein help yn ddiduedd ac am ddim i’w ddefnyddio, p’un ai yw hynny ar-lein neu dros y ffôn.              `,
        })}
      </Paragraph>
      <Paragraph>
        {z({
          en: 'Opening times: Monday to Friday, 9am to 5pm. Closed on bank holidays.',
          cy: `Amseroedd agor: Dydd Llun i Ddydd Gwener, 9am i 5pm. Ar gau ar wyliau banc.`,
        })}
      </Paragraph>
    </UrgentCallout>
  );
};
