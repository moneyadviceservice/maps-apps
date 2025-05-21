import { useRouter } from 'next/router';

import { H2 } from '@maps-react/common/components/Heading';
import { TeaserCard } from '@maps-react/common/components/TeaserCard';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import calculatorHouse from '../../public/images/teaser-card-images/calculator_house.png';
import calculatorHouse2 from '../../public/images/teaser-card-images/calculator_house2.png';

export const OtherTools = ({ isEmbedded }: { isEmbedded?: boolean }) => {
  const { z } = useTranslation();
  const router = useRouter();
  const { language } = router.query;
  return (
    <div className="space-y-4">
      <H2 color="text-blue-800 text-[28px]">
        {z({
          en: 'Other tools to try',
          cy: 'Teclynnau eraill i roi cynnig arnynt',
        })}
      </H2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <TeaserCard
          headingLevel={'h3'}
          title={z({
            en: 'Calculate the mortgage you can afford',
            cy: "Cyfrifo'r morgais y gallwch ei fforddio",
          })}
          href={`https://www.moneyhelper.org.uk/${language}/homes/buying-a-home/mortgage-affordability-calculator`}
          hrefTarget={isEmbedded ? '_blank' : undefined}
          image={calculatorHouse}
          imageClassName="md:h-[200px]"
          description={z({
            en: 'This tool can help you estimate how much you can afford to borrow to buy a home.',
            cy: "Mae'r teclyn hwn yn eich helpu i gyfrifo faint gallwch fforddio ei fenthyg i brynu cartref",
          })}
        />
        <TeaserCard
          headingLevel={'h3'}
          title={z({
            en: 'Calculate your Stamp Duty',
            cy: 'Cyfrifo eich Treth Stamp',
          })}
          href={`https://www.moneyhelper.org.uk/${language}/homes/buying-a-home/stamp-duty-calculator`}
          hrefTarget={isEmbedded ? '_blank' : undefined}
          image={calculatorHouse2}
          imageClassName="md:h-[200px]"
          description={z({
            en: 'Find out with this tool what tax may be due when buying your home.',
            cy: 'Defnyddiwch y teclyn hwn i ddarganfod pa dreth a all fod yn ddyledus wrth brynu eich cartref',
          })}
        />
      </div>
    </div>
  );
};
