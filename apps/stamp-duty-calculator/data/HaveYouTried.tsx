import { H2 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { TeaserCard } from '@maps-react/common/components/TeaserCard';
import { TeaserCardContainer } from '@maps-react/common/components/TeaserCardContainer/TeaserCardContainer';
import useTranslation from '@maps-react/hooks/useTranslation';
import bubbles from 'public/teaser-card-images/bubbles.jpg';
import child from 'public/teaser-card-images/child.jpg';

export const HaveYouTried = ({
  isEmbedded,
  z,
}: {
  isEmbedded: boolean;
  z: ReturnType<typeof useTranslation>['z'];
}) => (
  <TeaserCardContainer gridCols={3}>
    <div className="space-y-4 t-have-you-tried">
      <H2 color="text-blue-700">
        {z({ en: 'Have you tried?', cy: 'Rhowch gynnig ar?' })}
      </H2>
      <Paragraph>
        {z({
          en: 'We have other tools that can help you understand and prepare for purchasing a property.',
          cy: 'Mae gennym declynnau eraill a all eich helpu i ddeall a pharatoi ar gyfer prynu eiddo.',
        })}
      </Paragraph>
    </div>
    <TeaserCard
      title={z({
        en: 'Mortgage calculator',
        cy: 'Cyfrifiannell morgais',
      })}
      href="https://www.moneyhelper.org.uk/en/homes/buying-a-home/mortgage-calculator"
      image={bubbles}
      description={z({
        en: "Calculate how much you'd pay each month on a mortgage",
        cy: 'Cyfrifwch faint byddwch yn ei dalu pob mis ar forgais',
      })}
      hrefTarget={isEmbedded ? '_blank' : undefined}
    />
    <TeaserCard
      title={z({
        en: 'Mortgage affordability calculator',
        cy: 'Cyfrifiannell fforddiadwyedd morgais',
      })}
      href="https://www.moneyhelper.org.uk/en/homes/buying-a-home/mortgage-affordability-calculator"
      image={child}
      description={z({
        en: 'Estimate how much you can afford to borrow to buy a home',
        cy: 'Amcangyfrifwch faint allwch fforddio benthyg i brynu cartref',
      })}
      hrefTarget={isEmbedded ? '_blank' : undefined}
    />
  </TeaserCardContainer>
);
