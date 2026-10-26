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
    listItem1,
    listItem2,
    disclaimer,
    buttonText,
    furtherHelp,
    guidesLinkText,
    guidesLink,
  } = landingText(z);

  return (
    <Landing
      intro={intro}
      content={
        <>
          <Paragraph>{content1}</Paragraph>
          <ListElement
            variant="unordered"
            color="blue"
            className="ml-7"
            items={[listItem1, listItem2]}
          />
          <Paragraph>{content2}</Paragraph>
          <Paragraph>{disclaimer}</Paragraph>
        </>
      }
      contentAfterButton={
        <Paragraph>
          {furtherHelp}{' '}
          <Link asInlineText href={guidesLink}>
            {guidesLinkText}
          </Link>
          .
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
