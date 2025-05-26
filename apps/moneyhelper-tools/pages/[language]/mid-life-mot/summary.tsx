import { DataPath } from 'types';
import { getQuestions } from 'utils/getQuestions';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ToolLinks } from '@maps-react/utils/getToolLinks';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { getServerSidePropsDefault, MidLifeMot } from '.';
import { Summary } from '../../../components/Summary/Summary';

type Props = {
  storedData: DataFromQuery;
  dataPath: DataPath;
  links: ToolLinks;
  isEmbed: boolean;
};

const MidLifeMotSummary = ({ storedData, dataPath, links, isEmbed }: Props) => {
  const { z } = useTranslation();
  const qs = getQuestions(z, dataPath);

  return (
    <MidLifeMot step="summary" isEmbed={isEmbed}>
      <Summary
        storedData={storedData}
        questions={qs}
        backLink={links.summary.backLink}
        nextLink={links.summary.nextLink}
        isEmbed={isEmbed}
      />
    </MidLifeMot>
  );
};

export default MidLifeMotSummary;

export const getServerSideProps = getServerSidePropsDefault;
