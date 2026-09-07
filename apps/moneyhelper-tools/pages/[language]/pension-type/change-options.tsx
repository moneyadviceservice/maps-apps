import { PensionTypeAnalytics } from 'components/Analytics/PensionTypeAnalytics';
import { CHANGE_ANSWER_API } from 'CONSTANTS';
import { pensionTypeText, Section } from 'data/form-content/text/pension-type';
import { DataPath } from 'types';
import { getQuestions } from 'utils/getQuestions';

import { ChangeAnswers } from '@maps-react/form/components/ChangeAnswers';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ToolLinks } from '@maps-react/utils/getToolLinks';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { getServerSidePropsDefault, PensionType } from '.';

type Props = {
  storedData: DataFromQuery;
  data: string;
  dataPath: DataPath;
  links: ToolLinks;
  lang: string;
  isEmbed: boolean;
};

const ChangeOptions = ({
  storedData,
  data,
  dataPath,
  links,
  lang,
  isEmbed,
}: Props) => {
  const { z } = useTranslation();
  const qs = getQuestions(z, dataPath);

  return (
    <PensionType step={5} isEmbed={isEmbed}>
      <PensionTypeAnalytics currentStep={5} formData={storedData}>
        <ChangeAnswers
          storedData={storedData}
          data={data}
          questions={qs}
          dataPath={dataPath}
          text={pensionTypeText(z, Section.CheckAnswers)}
          nextLink={links.change.nextLink}
          CHANGE_ANSWER_API={CHANGE_ANSWER_API}
          backLink={links.change.backLink}
          actionText={pensionTypeText(
            z,
            Section.ChangeAnswersPensionTypeAction,
          )}
          lang={lang}
          isEmbed={isEmbed}
        />
      </PensionTypeAnalytics>
    </PensionType>
  );
};

export default ChangeOptions;

export const getServerSideProps = getServerSidePropsDefault;
