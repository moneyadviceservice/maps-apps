import { ReactNode } from 'react';
import { DataFromQuery } from '@maps-react/utils/pageFilter';
import { ToolLinks } from 'utils/generateToolLinks';
import { Questions } from '@maps-react/form/components/Questions';
import { ErrorType, Question } from '@maps-react/form/types';

type Props = {
  storedData: DataFromQuery;
  data: string;
  currentStep: number;
  links: ToolLinks;
  isEmbed: boolean;
  toolPath: string;
  questions: Question[];
  errors: ErrorType[];
  helpSection?: ReactNode;
  pageError?: ReactNode;
};

export const QuestionPage = ({
  storedData,
  data,
  currentStep,
  links,
  isEmbed,
  toolPath,
  questions,
  errors,
  helpSection,
  pageError,
}: Props) => (
  <Questions
    storedData={storedData}
    data={data}
    questions={questions}
    errors={errors}
    currentStep={currentStep}
    backLink={links.question.backLink}
    dataPath={toolPath}
    apiCall={'/api/submit-answer'}
    isEmbed={isEmbed}
    alwaysDisplaySubText={true}
    bottomInfo={helpSection}
    topInfo={pageError}
  />
);
