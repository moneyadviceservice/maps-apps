import { Landing } from 'components/Landing';
import { Paragraph } from '@maps-digital/shared/ui';
import { useTranslation } from '@maps-digital/shared/hooks';
import { addEmbedQuery } from 'utils/addEmbedQuery';
import { landingText } from 'data/pension-type';

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
