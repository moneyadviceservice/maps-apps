import { PropsWithChildren, ReactNode } from 'react';

import { useRouter } from 'next/router';

import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { StepContainer } from '@maps-react/form/components/StepContainer';
import { Question } from '@maps-react/form/types';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { APIS } from '../../CONSTANTS';
import { ToolLinks } from '../../utils/generateToolLinks';
import { FLOW } from '../../utils/getQuestions';

type Props = {
  storedData: DataFromQuery;
  data: string;
  prevCookieData: string;
  currentStep: number;
  questions: Question[];
  links: ToolLinks;
  isEmbed: boolean;
  currentFlow: FLOW;
  prefix: string;
  pageError?: ReactNode;
};

export const QuestionsWrapper = ({
  storedData,
  data,
  prevCookieData,
  currentStep,
  questions,
  links,
  isEmbed,
  currentFlow,
  prefix,
  pageError,
  children,
}: Props & PropsWithChildren) => {
  const router = useRouter();
  const { z } = useTranslation();

  const question = questions[currentStep - 1];

  return (
    <StepContainer
      backLink={links.question.backLink}
      data={data}
      lang={router.query.language}
      action={`/${APIS.SUBMIT_ANSWER}`}
      buttonText={
        storedData[`changeAnswer`] === String(prefix + currentStep)
          ? z({ en: 'Save changes', cy: 'Arbed newidiadau' })
          : z({ en: 'Continue', cy: 'Parhau' })
      }
      dataPath={currentFlow}
      isEmbed={isEmbed}
      buttonClassName={'w-full sm:w-auto'}
      currentStep={currentStep}
    >
      <div className="mt-8 lg:max-w-[840px]">
        <input type="hidden" name="type" value={question.subType} />
        <input
          type="hidden"
          name="question"
          value={prefix + String(question?.questionNbr)}
        />
        <input
          type="hidden"
          name="prevCookieData"
          value={prevCookieData}
          data-testid={'prevCookieData'}
        />
        <div className="mt-4">
          {pageError}
          <legend>
            <Heading
              level={'h1'}
              className="pb-4"
              data-testid="questions-heading"
            >
              {question.title}
            </Heading>
          </legend>
          {typeof question.definition === 'string' ? (
            <Paragraph className="py-4" data-testid={'string-definition'}>
              {question.definition}
            </Paragraph>
          ) : (
            <div data-testid={'non-string-definition'}>
              {question.definition}
            </div>
          )}
          {children}
        </div>
      </div>
    </StepContainer>
  );
};
