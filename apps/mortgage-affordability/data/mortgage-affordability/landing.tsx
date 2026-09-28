import { LandingProps } from '@maps-react/pension-tools/components/Landing';

import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export const landingContent = (
  z: ReturnType<typeof useTranslation>['z'],
): LandingProps => {
  return {
    intro: z({
      en: "When it comes to mortgages, you want to find that balancing act of borrowing enough for your home, but not too much that the repayments become a problem. And that's where our mortgage affordability calculator comes in.",
      cy: "O ran morgeisi, rydych eisiau darganfod y weithred gydbwyso honno o fenthyca digon i'ch cartref, ond dim gormod fel bod yr ad-daliadau yn dod yn broblem. A dyna lle mae ein cyfrifiannell fforddiadwyedd morgais yn dod i mewn.",
    }),
    content: z({
      en: (
        <>
          <Heading level="h2">
            How much can you afford to borrow for a mortgage?
          </Heading>
          <Paragraph>
            Just tell us how much you earn and what your monthly outgoings are,
            and we&apos;ll help you estimate how much you can afford to borrow
            for a mortgage.
          </Paragraph>
          <Paragraph>
            When you get your results you can change the repayment period or
            interest rate to make it more closely match any mortgages
            you&apos;re thinking of applying for. And we&apos;ll tell you how
            much money you&apos;ll have left over each month.
          </Paragraph>
        </>
      ),
      cy: (
        <>
          <Heading level="h2">
            Faint allwch chi fforddio ei fenthyg am forgais?
          </Heading>
          <Paragraph>
            Dywedwch wrthym faint rydych yn ei ennill a beth yw eich treuliau
            misol, a byddwn yn eich helpu i amcangyfrif faint y gallwch chi
            fforddio ei fenthyg am forgais.
          </Paragraph>
          <Paragraph>
            Pan gewch eich canlyniadau gallwch newid y cyfnod ad-dalu neu&apos;r
            gyfradd llog i gyfateb yn agosach at unrhyw forgeisiau rydych yn
            ystyried gwneud cais amdanynt. A byddwn yn dweud wrthych faint o
            arian y bydd gennych ar ôl bob mis.
          </Paragraph>
        </>
      ),
    }),
    actionLink: z({
      en: '/en/annual-income',
      cy: '/cy/annual-income',
    }),
    actionText: z({
      en: 'Start mortgage affordability calculator',
      cy: 'Cyfrifiannell fforddiadwyedd morgais',
    }),
  };
};
