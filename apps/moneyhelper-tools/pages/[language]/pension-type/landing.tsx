import { Landing } from 'components/Landing';
import { landingText } from 'data/pension-type';

import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';

type Props = {
  lang: string;
  isEmbed?: boolean;
};

const PensionTypeLanding = ({ lang, isEmbed }: Props) => {
  const { z } = useTranslation();
  const { intro, content1, content2, buttonText } = landingText(z);

  return (
    <Landing
      intro={intro}
      content={
        <>
          <Paragraph>{content1}</Paragraph>
          <Paragraph>{content2}</Paragraph>
        </>
      }
      actionLink={`/${lang}/pension-type/question-1${addEmbedQuery(
        !!isEmbed,
        '?',
      )}`}
      actionText={buttonText}
    />
  );
};

export default PensionTypeLanding;
