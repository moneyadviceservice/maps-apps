import { Landing } from 'components/Landing';
import { Paragraph, ListElement } from '@maps-digital/shared/ui';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';
import { UrgentCalloutMessage } from 'components/PensionCalculator';

type Props = {
  lang: string;
  isEmbed: boolean;
};

const LandingContent = () => {
  const { z } = useTranslation();
  const items = [
    z({
      en: 'your employer pays into your pension ',
      cy: `bydd eich cyflogwr yn talu i mewn i'ch pensiwn`,
    }),
    z({
      en: 'you’re paying into your pension',
      cy: `rydych chi'n talu i mewn i'ch pensiwn`,
    }),

    z({
      en: 'tax relief you’re getting on your pension contributions.',
      cy: 'rhyddhad treth rydych yn ei gael ar eich cyfraniadau pensiwn.',
    }),
  ];

  return (
    <>
      <Paragraph>
        {z({
          en: 'A certain percentage of your salary has to be paid into your pension as a legal minimum – and both you and your employer have to pay into it.',
          cy: `Rhaid talu canran benodol o'ch cyflog fewn i'ch pensiwn fel isafswm cyfreithiol - ac mae'n rhaid i chi a'ch cyflogwr dalu i mewn iddo.`,
        })}
      </Paragraph>
      <Paragraph>
        {z({
          en: 'We’ll help you work out how much:',
          cy: 'Byddwn yn eich helpu i weithio allan faint:',
        })}
      </Paragraph>
      <ListElement
        variant="unordered"
        color="blue"
        className="ml-7"
        items={items}
      />
    </>
  );
};

const WPCCLanding = ({ lang, isEmbed }: Props) => {
  const { z } = useTranslation();

  return (
    <>
      <Landing
        className="lg:container-auto lg:max-w-[960px]"
        intro={z({
          en: 'If you’re an employee you’ve probably been automatically enrolled into a pension by your employer. Use our workplace pension contribution calculator to help you work out how much is getting paid into your pension.',
          cy: `Os ydych yn gyflogai mae'n debyg eich bod wedi'ch ymrestru'n awtomatig mewn pensiwn gan eich cyflogwr. Defnyddiwch ein cyfrifiannell cyfraniadau pensiwn gweithle i'ch helpu i ddarganfod faint sy'n cael ei dalu fewn i'ch pensiwn.`,
        })}
        content={<LandingContent />}
        actionLink={`/${lang}/workplace-pension-calculator/calculator${addEmbedQuery(
          !!isEmbed,
          '?',
        )}`}
        actionText={z({
          en: 'Start workplace pension contribution calculator',
          cy: 'Dechrau cyfrifiannell cyfraniadau pensiwn gweithle',
        })}
      />
      <Container className="lg:container-auto pt-4 pb-1.5 lg:max-w-[960px]">
        <UrgentCalloutMessage lang={lang} />
      </Container>
    </>
  );
};

export default WPCCLanding;
