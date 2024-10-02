import { ResultsCallout } from '../ResultsCallout';
import {
  ResultFieldKeys,
  resultsContent,
} from 'data/mortgage-affordability/results';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ChildFormData } from 'pages/[language]/mortgage-affordability-calculator/results';

type Props = {
  formData: Record<string, string>;
  resultFormData: ChildFormData;
  searchQuery: string;
};

export const ResultsSummary = ({
  formData,
  resultFormData,
  searchQuery,
}: Props) => {
  const { z } = useTranslation();
  const d = resultsContent(z, searchQuery);

  return (
    <ResultsCallout
      copy={d}
      borrowAmount={resultFormData?.[ResultFieldKeys.BORROW_AMOUNT]}
      term={resultFormData?.[ResultFieldKeys.TERM]}
      interestRate={resultFormData?.[ResultFieldKeys.INTEREST]}
      formData={formData}
      isSummary={true}
    />
  );
};
