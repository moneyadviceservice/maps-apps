import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ToolLinks } from '@maps-react/utils/getToolLinks';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { getServerSidePropsDefault, MidLifeMot } from '.';
import { Summary } from '../../components/Summary/Summary';
import { midLifeMotQuestions } from '../../data/form-content/questions/mid-life-mot';

type Props = {
  storedData: DataFromQuery;
  links: ToolLinks;
  isEmbed: boolean;
};

const MidLifeMotSummary = ({ storedData, links, isEmbed }: Props) => {
  const { z } = useTranslation();
  const qs = midLifeMotQuestions(z);

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
