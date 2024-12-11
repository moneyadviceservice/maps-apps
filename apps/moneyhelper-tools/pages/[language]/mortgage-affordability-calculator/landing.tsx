import { Landing } from 'components/Landing';
import { landingContent } from 'data/mortgage-affordability/landing';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';

type Props = {
  isEmbed?: boolean;
};

export const MortgageAffordabilityLanding = ({ isEmbed }: Props) => {
  const { z } = useTranslation();
  const { content, intro, actionLink, actionText, additionalInformation } =
    landingContent(z);

  return (
    <Landing
      intro={intro}
      content={content}
      actionLink={`${actionLink}${addEmbedQuery(!!isEmbed, '?')}`}
      actionText={actionText}
      additionalInformation={additionalInformation}
    />
  );
};

export default MortgageAffordabilityLanding;
