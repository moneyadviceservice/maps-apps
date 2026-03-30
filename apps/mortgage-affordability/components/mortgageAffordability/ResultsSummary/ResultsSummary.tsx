import {
  ResultFieldKeys,
  resultsContent,
} from 'data/mortgage-affordability/results';
import { ChildFormData } from 'pages/[language]/results';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { ResultsCallout } from '../ResultsCallout';

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
