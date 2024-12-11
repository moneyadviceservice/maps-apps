import { Landing } from 'components/Landing';

import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';

type Props = {
  lang: string;
  isEmbed?: boolean;
};

const LandingContent = () => {
  const { z } = useTranslation();
  return (
    <>
      {' '}
      <Paragraph>
        {z({
          en: "The NHS suggests some essentials you'll need for your baby - think things like bedding, clothing and nappies.",
          cy: '',
        })}
      </Paragraph>
      <Paragraph>
        {z({
          en: "Then we've put together some other things you might want to think about getPackedSettings, everything from things for your new baby's bedroom to travel items.",
          cy: '',
        })}
      </Paragraph>
      <Paragraph>
        {z({
          en: "Tell us your budget and we'll let you know how your actual costs will stack up.",
          cy: '',
        })}
      </Paragraph>
    </>
  );
};

const BabyCostCalculatorLanding = ({ lang, isEmbed }: Props) => {
  const { z } = useTranslation();

  return (
    <Landing
      intro={z({
        en: "It's great you're expecting or planning on having a baby. Making sure your finances can handle a new addition to your family can be tricky. That's where the baby costs calculator can help.",
        cy: '',
      })}
      content={<LandingContent />}
      actionLink={`/${lang}/baby-cost-calculator/1${addEmbedQuery(
        !!isEmbed,
        '?',
      )}`}
      actionText={z({
        en: 'Start baby costs calculator',
        cy: '',
      })}
    />
  );
};

export default BabyCostCalculatorLanding;
