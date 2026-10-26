import { useRouter } from 'next/router';

import { H2 } from '@maps-react/common/components/Heading';
import { TeaserCard } from '@maps-react/common/components/TeaserCard';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import calculatorHouse from '../../public/images/teaser-card-images/calculator_house.png';
import calculatorHouse2 from '../../public/images/teaser-card-images/calculator_house2.png';

export const OtherTools = ({ isEmbedded }: { isEmbedded?: boolean }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { language } = router.query;
  return (
    <div className="space-y-4">
      <H2 color="text-blue-700 text-[28px]">{t('otherTools.title')}</H2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <TeaserCard
          headingLevel={'h3'}
          title={t('otherTools.card1.title')}
          href={`https://www.moneyhelper.org.uk/${language}/homes/buying-a-home/mortgage-affordability-calculator`}
          hrefTarget={isEmbedded ? '_blank' : undefined}
          image={calculatorHouse}
          imageClassName="md:h-[200px]"
          description={t('otherTools.card1.description')}
        />
        <TeaserCard
          headingLevel={'h3'}
          title={t('otherTools.card2.title')}
          href={`https://www.moneyhelper.org.uk/${language}/homes/buying-a-home/stamp-duty-calculator`}
          hrefTarget={isEmbedded ? '_blank' : undefined}
          image={calculatorHouse2}
          imageClassName="md:h-[200px]"
          description={t('otherTools.card2.description')}
        />
      </div>
    </div>
  );
};
