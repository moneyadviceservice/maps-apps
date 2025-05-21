import { ReactNode } from 'react';

import { Link } from '@maps-react/common/components/Link';
import useTranslation from '@maps-react/hooks/useTranslation';

interface TranslationText {
  en: string | ReactNode;
  cy: string | ReactNode;
}

interface SectionData {
  id: string;
  title: TranslationText;
  condition?: string;
  links: ReactNode[];
}

export interface RecommendedReadingData {
  title: TranslationText;
  sections: SectionData[];
}

export const getRecommendedReadingData = (
  z: ReturnType<typeof useTranslation>['z'],
  language: string | string[] | undefined,
  isEmbedded?: boolean,
): RecommendedReadingData => {
  return {
    title: {
      en: 'Recommended reading',
      cy: "Gwybodaeth a argymhellir i'w ddarllen",
    },
    sections: [
      {
        id: 'repayQuicker',
        title: {
          en: 'Repay your mortgage quicker',
          cy: 'Ad-dalu eich morgais yn gyflymach',
        },
        condition: 'interestonly',
        links: [
          <>
            {z({
              en: 'Explore',
              cy: 'Archwiliwch',
            })}{' '}
            <Link
              asInlineText={true}
              target={isEmbedded ? '_blank' : ''}
              href={`https://www.moneyhelper.org.uk/${language}/homes/buying-a-home/ways-of-repaying-an-interest-only-mortgage`}
            >
              {z({
                en: 'ways of repaying an interest-only mortgage',
                cy: 'ffyrdd o ad-dalu morgais llog yn unig',
              })}{' '}
            </Link>
          </>,
        ],
      },
      {
        id: 'firstTimeBuyers',
        title: {
          en: 'First-time buyers',
          cy: 'Prynwyr tro cyntaf',
        },
        links: [
          <>
            {z({
              en: 'Read our',
              cy: 'Darllenwch ein',
            })}{' '}
            <Link
              asInlineText={true}
              target={isEmbedded ? '_blank' : ''}
              href={`https://www.moneyhelper.org.uk/${language}/homes/buying-a-home/first-time-buyer-money-tips`}
            >
              {z({
                en: 'first-time home buyer guide',
                cy: 'canllaw Prynwyr tro cyntaf',
              })}{' '}
            </Link>
          </>,
          <>
            {z({
              en: 'How to',
              cy: 'Sut i',
            })}{' '}
            <Link
              asInlineText={true}
              target={isEmbedded ? '_blank' : ''}
              href={`https://www.moneyhelper.org.uk/${language}/homes/buying-a-home/saving-money-for-a-mortgage-deposit`}
            >
              {z({
                en: 'save money for a mortgage deposit',
                cy: 'gynilo arian ar gyfer blaendal morgais',
              })}{' '}
            </Link>
          </>,
        ],
      },
      {
        id: 'mortgageEssentials',
        title: {
          en: 'Mortgage essentials',
          cy: 'Hanfodion morgais',
        },
        links: [
          <>
            {z({
              en: 'What are they and',
              cy: 'Beth ydynt ac',
            })}{' '}
            <Link
              asInlineText={true}
              target={isEmbedded ? '_blank' : ''}
              href={`https://www.moneyhelper.org.uk/${language}/homes/buying-a-home/choosing-a-mortgage-shop-around-or-get-advice`}
            >
              {z({
                en: 'should you use a mortgage adviser?',
                cy: 'a ddylech ddefnyddio cynghorydd morgais?',
              })}{' '}
            </Link>
          </>,
          <>
            {z({
              en: 'Help',
              cy: 'Help i',
            })}{' '}
            <Link
              asInlineText={true}
              target={isEmbedded ? '_blank' : ''}
              href={`https://www.moneyhelper.org.uk/${language}/homes/buying-a-home/mortgage-interest-rate-options`}
            >
              {z({
                en: 'understanding mortgage interest rates',
                cy: 'ddeall cyfraddau llog morgais',
              })}{' '}
            </Link>
          </>,
          <>
            {z({
              en: 'Get the right deal with our',
              cy: "Sicrhewch y cytundeb iawn gyda'n",
            })}{' '}
            <Link
              asInlineText={true}
              target={isEmbedded ? '_blank' : ''}
              href={`https://www.moneyhelper.org.uk/${language}/homes/buying-a-home/your-mortgage-comparison-checklist`}
            >
              {z({
                en: 'mortgage comparison checklist',
                cy: 'rhestr gwirio cymharu morgais',
              })}{' '}
            </Link>
          </>,
        ],
      },
      {
        id: 'budgetPlanning',
        title: {
          en: 'Budget planning',
          cy: 'Cynllunio cyllideb',
        },
        links: [
          <>
            {z({
              en: 'Budget for',
              cy: 'Cyllideb ar gyfer',
            })}{' '}
            <Link
              asInlineText={true}
              target={isEmbedded ? '_blank' : ''}
              href={`https://www.moneyhelper.org.uk/${language}/homes/buying-a-home/estimate-your-overall-buying-and-moving-costs`}
            >
              {z({
                en: 'the cost of buying a house and moving',
                cy: 'cost prynu tŷ a symud',
              })}{' '}
            </Link>
          </>,
          <>
            {z({
              en: 'Learn',
              cy: 'Dysgwch',
            })}{' '}
            <Link
              asInlineText={true}
              target={isEmbedded ? '_blank' : ''}
              href={`https://www.moneyhelper.org.uk/${language}/homes/buying-a-home/how-to-prepare-for-an-interest-rate-rise`}
            >
              {z({
                en: 'how to prepare for an interest rate rise',
                cy: 'sut i baratoi ar gyfer cynnydd mewn cyfraddau llog',
              })}{' '}
            </Link>
          </>,
        ],
      },
      {
        id: 'strugglingToPay',
        title: {
          en: 'Struggling to pay?',
          cy: 'Cael trafferth talu?',
        },
        links: [
          <>
            {z({
              en: "Advice if you're facing",
              cy: 'Cyngor os ydych yn wynebu',
            })}{' '}
            <Link
              asInlineText={true}
              target={isEmbedded ? '_blank' : ''}
              href={`https://www.moneyhelper.org.uk/${language}/homes/buying-a-home/mortgage-arrears-if-you-have-problems-paying-your-mortgage`}
            >
              {z({
                en: 'mortgage arrears or problems paying your mortgage',
                cy: 'ôl-ddyledion morgais neu broblemau talu eich morgais',
              })}{' '}
            </Link>
          </>,
          <>
            {z({
              en: 'Support and',
              cy: 'Cefnogaeth a',
            })}{' '}
            <Link
              asInlineText={true}
              target={isEmbedded ? '_blank' : ''}
              href={`https://www.moneyhelper.org.uk/${language}/homes/buying-a-home/government-help-if-you-cant-pay-your-mortgage`}
            >
              {z({
                en: "Government help if you can't pay your mortgage",
                cy: 'Help y llywodraeth os na allwch dalu eich morgais',
              })}{' '}
            </Link>
          </>,
        ],
      },
    ],
  };
};
