import { useState } from 'react';

import { useRouter } from 'next/router';

import { FormPage } from 'components/form/FormPage';
import { confirmDetailsPage } from 'data/pages/account/firm-details/confirm-details';
import { useErrorSummary } from 'hooks/useErrorSummary';
import { getValueByPath } from 'lib/firms/getValueByPath';
import { twMerge } from 'tailwind-merge';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';
import { createSubmitHandler } from 'utils/helper/form/createSubmitHandler';

import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';

import { DefaultHiddenFields } from '../DefaultHiddenFields';

type Props = {
  firmData: TravelInsuranceFirmDocument;
  firmId: string;
};

export const ConfirmDetails = ({ firmData, firmId }: Props) => {
  const router = useRouter();
  const { setFormSummaryErrors } = useErrorSummary();

  const [isPending, setIsPending] = useState(false);

  const onSubmit = createSubmitHandler({
    apiUrl: confirmDetailsPage.submitApi,
    nextStep: confirmDetailsPage.nextStep,
    setIsPending,
    setFormSummaryErrors,
    router,
  });

  return (
    <FormPage
      submitAction={(e) => onSubmit(e)}
      nonJsSubmitFallback={confirmDetailsPage.submitApi}
      isPending={isPending}
      formName={confirmDetailsPage.formKey}
      submitButtonLabel={confirmDetailsPage.buttonLabel}
    >
      <DefaultHiddenFields firmId={firmId} />
      {confirmDetailsPage.questionsSections.map((section) => {
        return (
          <div key={section.key}>
            <Heading level={'h2'} className="mt-16 mb-8">
              {section.title}
            </Heading>
            <div role="table" aria-label={section.title} className="w-full">
              <div
                role="row"
                className="hidden md:grid grid-cols-8 gap-x-7 border-b border-slate-400 pb-2 font-bold text-base"
              >
                <div
                  role="columnheader"
                  className="col-span-4"
                  data-testid="question-header"
                >
                  {section.title} questions
                </div>
                <div
                  role="columnheader"
                  className="col-span-3"
                  data-testid="submission-header"
                >
                  Submission
                </div>
                <div role="columnheader" className="col-span-1">
                  <span className="sr-only">Actions</span>
                </div>
              </div>

              {section.questions.map(({ key, title, dataPath, hideWhen }) => {
                const answer =
                  dataPath && getValueByPath(firmData, `${dataPath}/${key}`);

                if (hideWhen) {
                  const hw = hideWhen.field;
                  const targetDataPath = hw.dataPath || dataPath;
                  const hwAnswer = targetDataPath
                    ? getValueByPath(firmData, `${targetDataPath}/${hw.key}`)
                    : undefined;
                  if (hwAnswer === hideWhen.value) {
                    return null;
                  }
                }

                return (
                  <div
                    role="row"
                    key={key}
                    className="grid grid-cols-1 pb-6 md:grid-cols-8 gap-x-7 md:border-b border-slate-400 md:pb-2 md:mt-2"
                  >
                    <div
                      role="cell"
                      className="col-span-1 mb-2 text-base md:col-span-4"
                      data-testid={`dt-${key}`}
                    >
                      <span className="block md:hidden font-bold text-sm mb-1">
                        {section.title}{' '}
                      </span>
                      {title}
                    </div>
                    <div
                      role="cell"
                      className={twMerge(
                        answer &&
                          ['yes', 'no'].includes(answer) &&
                          'capitalize',
                        'col-span-1 mb-2 md:col-span-3 obfuscate',
                      )}
                      data-testid={`dd-${key}`}
                    >
                      <span className="block md:hidden font-bold text-sm mb-1">
                        Submission
                      </span>{' '}
                      {answer ?? 'n/a'}
                    </div>

                    <div role="cell" className="col-span-1">
                      <Link
                        className="gap-0 align-top"
                        href={`${section.linkToPage}/${firmId}?change=true#${key}`}
                        data-testid={`change-question-${key}`}
                      >
                        Change{' '}
                        <span className="sr-only">your answer for {title}</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </FormPage>
  );
};
