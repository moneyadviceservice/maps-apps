import { Landing } from 'components/Landing';
import {
  Paragraph,
  ListElement,
  UrgentCallout,
  Heading,
  Container,
  Link,
} from '@maps-digital/shared/ui';
import { useTranslation } from '@maps-digital/shared/hooks';

type Props = {
  lang: string;
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

const WPCCLanding = ({ lang }: Props) => {
  const { z } = useTranslation();

  return (
    <>
      <Landing
        intro={z({
          en: 'If you’re an employee you’ve probably been automatically enrolled into a pension by your employer. Use our workplace pension contribution calculator to help you work out how much is getting paid into your pension.',
          cy: `Os ydych yn gyflogai mae'n debyg eich bod wedi'ch ymrestru'n awtomatig mewn pensiwn gan eich cyflogwr. Defnyddiwch ein cyfrifiannell cyfraniadau pensiwn gweithle i'ch helpu i ddarganfod faint sy'n cael ei dalu fewn i'ch pensiwn.`,
        })}
        content={<LandingContent />}
        actionLink={`/${lang}/workplace-pension-calculator`}
        actionText={z({
          en: 'Start workplace pension contribution calculator',
          cy: 'Dechrau cyfrifiannell cyfraniadau pensiwn gweithle',
        })}
      />
      <Container>
        <div className="lg:max-w-[840px] space-y-8">
          <UrgentCallout variant="arrow">
            <Heading level="h3" className="font-semibold mb-6">
              {z({
                en: 'Need more information on pensions?',
                cy: 'Angen mwy o wybodaeth am bensiynau?',
              })}
            </Heading>
            <Paragraph>
              {z({
                en: 'Call our helpline free on',
                cy: `Ffoniwch ni am ddim ar`,
              })}{' '}
              <Link href="tel:08000113797">0800 011 3797</Link>{' '}
              {z({
                en: 'or in a new window. One of our pension specialists will be happy to answer your questions.',
                cy: `neu agor mewn ffenestr newydd. Bydd un o’n harbenigwyr pensiwn yn hapus i ateb eich cwestiynau.`,
              })}{' '}
              <Link
                href={`https://www.moneyhelper.org.uk/${
                  lang === 'en' ? 'PensionsChat' : 'welshchat'
                }`}
              >
                {z({
                  en: 'use our webchat',
                  cy: `defnyddiwch ein gwe-sgwrsYn`,
                })}
              </Link>{' '}
              {z({
                en: 'in a new window. One of our pension specialists will be happy to answer your questions.',
                cy: `agor mewn ffenestr newydd. Bydd un o’n harbenigwyr pensiwn yn hapus i ateb eich cwestiynau.`,
              })}
            </Paragraph>

            <Paragraph>
              {z({
                en: 'Our help is impartial and free to use, whether that’s online or over the phone.',
                cy: `Mae ein help yn ddiduedd ac am ddim i’w ddefnyddio, p’un ai yw hynny ar-lein neu dros y ffôn.`,
              })}
            </Paragraph>
            <Paragraph>
              {z({
                en: 'Opening times: Monday to Friday, 9am to 5pm. Closed on bank holidays.',
                cy: `Amseroedd agor: Dydd Llun i Ddydd Gwener, 9am i 5pm. Ar gau ar wyliau banc.`,
              })}
            </Paragraph>
          </UrgentCallout>
        </div>
      </Container>
    </>
  );
};

export default WPCCLanding;
