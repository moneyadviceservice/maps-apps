import { landingText } from 'data/pension-type';

import { Link } from '@maps-react/common/components/Link';
import { ListElement } from '@maps-react/common/components/ListElement';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Landing } from '@maps-react/pension-tools/components/Landing';
import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';

type Props = {
  lang: string;
  isEmbed?: boolean;
};

const PensionTypeLanding = ({ lang, isEmbed }: Props) => {
  const { z } = useTranslation();
  const {
    intro,
    content1,
    content2,
    content3,
    content4,
    content5,
    bullet1,
    bullet2,
    buttonText,
  } = landingText(z);

  const pensionsExplainedLink = z({
    en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics',
    cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics',
  });

  return (
    <Landing
      intro={intro}
      content={
        <>
          <Paragraph>{content1}</Paragraph>
          <ListElement
            variant="unordered"
            color="blue"
            className="mb-4 ml-7"
            items={[bullet1, bullet2]}
          />
          <Paragraph>{content2}</Paragraph>
          <Paragraph>{content3}</Paragraph>
        </>
      }
      contentAfterButton={
        <Paragraph>
          {content4} <Link href={pensionsExplainedLink}>{content5}</Link>.
        </Paragraph>
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
