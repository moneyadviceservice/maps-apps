import { resultsOtherToolsData } from 'data/otherToolsToTry';
import { getRetirementStatusFlags } from 'lib/results';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { OtherToolsToTry } from '@maps-react/pension-tools/components/OtherToolsToTry/OtherToolsToTry';
import { DataFromQuery } from '@maps-react/utils/pageFilter/pageFilter';

import { ResultsHeading } from '../Heading/ResultsHeading';
import { ResultsCTAs } from '../ResultsCTAs/ResultsCTAs';
import { StaticGuidance } from '../StaticGuidance/StaticGuidance';
import { VariableGuidance } from '../VariableGuidance/VariableGuidance';

type Props = {
  changeAnswerLink: string;
  data: DataFromQuery;
};

const MainResults = ({ changeAnswerLink, data }: Props) => {
  const { t, locale } = useTranslation();
  const content = resultsOtherToolsData({ t, locale });

  const [retireInNext10Years, notRetireInNext10Years, , alreadyRetired] =
    getRetirementStatusFlags(data);

  return (
    <div className="space-y-8">
      <ResultsHeading />
      <VariableGuidance data={data} />

      <StaticGuidance
        retireInNext10Years={retireInNext10Years}
        notRetireInNext10Years={notRetireInNext10Years}
        alreadyRetired={alreadyRetired}
      />

      <OtherToolsToTry content={content} level="h3" variant="primary" />
      <ResultsCTAs changeAnswerLink={changeAnswerLink} />
    </div>
  );
};

export default MainResults;
