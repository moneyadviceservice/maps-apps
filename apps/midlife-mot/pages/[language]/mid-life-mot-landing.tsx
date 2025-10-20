import { Button } from '@maps-react/common/components/Button';
import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useLanguage } from '@maps-react/hooks/useLanguage';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Landing } from '@maps-react/pension-tools/components/Landing';
import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';

type Props = {
  lang: string;
  isEmbed?: boolean;
};

const LandingContent = () => {
  const { z } = useTranslation();
  const lang = useLanguage();

  return (
    <>
      {' '}
      <Paragraph>
        {z({
          en: "We'll ask a series of questions about your finances.",
          cy: 'Byddwn yn gofyn cyfres o gwestiynau am eich sefyllfa ariannol.',
        })}
      </Paragraph>
      <Paragraph>
        {z({
          en: "You won't need any documents or extra information to use thetool.",
          cy: "Ni fydd angen unrhyw ddogfennau na gwybodaeth ychwanegol arnoch i ddefnyddio'r teclyn.",
        })}{' '}
        <span className="font-bold">
          {z({
            en: 'It should take about 5 minutes to complete.',
            cy: "Dylai gymryd tua 5 munud i'w gwblhau.",
          })}
        </span>
      </Paragraph>
      <Paragraph>
        {z({
          en: 'The information you provide will be kept completely anonymous, but you can download your results.',
          cy: "Bydd y wybodaeth a roddwch yn cael ei chadw'n gwbl ddienw, ond gallwch lawrlwytho'ch canlyniadau.",
        })}
      </Paragraph>
      <div className="py-8">
        <Button variant="primary" as="a" href="mid-life-mot/question-1">
          {z({
            en: 'Start your Money Midlife MOT',
            cy: 'Dechreuwch eich MOT Canol Oes Arian',
          })}
        </Button>
      </div>
      <Heading level="h5">
        {z({ en: 'Before you start', cy: 'Cyn i chi ddechrau' })}
      </Heading>
      <Paragraph>
        <span className="font-bold">
          {z({
            en: "If you're dealing with debt",
            cy: 'Os ydych yn delio â dyled',
          })}
        </span>
        ,{' '}
        {z({
          en: 'get help as soon as possible. You can find free debt advice using our',
          cy: 'mynnwch gymorth cyn gynted â phosibl. Gallwch ddod o hyd i gyngor ar ddyledion am ddim gan ddefnyddio ein',
        })}{' '}
        <Link
          target={'_blank'}
          href={`https://www.moneyhelper.org.uk/${lang}/money-troubles/dealing-with-debt/debt-advice-locator`}
        >
          {' '}
          {z({
            en: 'Debt advice locator.',
            cy: 'Lleolwr cyngor ar ddyledion',
          })}
        </Link>
      </Paragraph>
      <Paragraph>
        <span className="font-bold">
          {z({ en: "If you're under 45", cy: 'Os ydych o dan 45 oed' })}
        </span>
        ,{' '}
        {z({
          en: 'the following resources may be better suited to help you get your finances on track:',
          cy: "efallai y bydd yr adnoddau canlynol yn fwy addas i'ch helpu i gael eich arian ar y trywydd iawn:",
        })}
      </Paragraph>
      <ul className="text-magenta-500 list-disc list-inside">
        <li>
          <Link
            href={`https://www.moneyhelper.org.uk/${lang}/everyday-money`}
            target={'_blank'}
          >
            {z({ en: 'Everyday money', cy: 'Arian bob dydd' })}
          </Link>
        </li>
        <li>
          <Link
            href={`https://www.moneyhelper.org.uk/${lang}/family-and-care`}
            target={'_blank'}
          >
            {z({ en: 'Family & care', cy: 'Teulu a gofal' })}
          </Link>
        </li>
        <li>
          <Link
            href={`https://www.moneyhelper.org.uk/${lang}/everyday-money/budgeting/budget-planner`}
            target={'_blank'}
          >
            {z({ en: 'Budget Planner', cy: 'Cynlluniwr Cyllideb' })}
          </Link>
        </li>
      </ul>
      <Paragraph>
        <span className="font-bold">
          {z({ en: "If you're over 65", cy: 'Os ydych chi dros 65' })}
        </span>
        ,{' '}
        {z({
          en: 'we recommend reading',
          cy: 'rydym yn argymell darllen',
        })}{' '}
        <Link
          href={`https://www.moneyhelper.org.ukpensions-and-retirement`}
          target={'_blank'}
        >
          {z({
            en: 'our pages on pensions and retirement.',
            cy: 'ein tudalennau ar bensiynau ac ymddeoliad',
          })}
        </Link>
      </Paragraph>
      <Paragraph>
        <span className="font-bold">
          {z({
            en: "If you're worried you might have to retire sooner than expected due to a serious health condition",
            cy: "Os ydych yn poeni efallai y bydd yn rhaid i chi ymddeol yn gynt na'r disgwyl oherwydd cyflwr iechyd difrifol",
          })}
        </span>
        ,{' '}
        {z({
          en: 'we suggest prioritising your retirement planning. See',
          cy: 'rydym yn awgrymu y dylech flaenoriaethu eich cynllunio ymddeoliad. Gweler',
        })}{' '}
        <Link
          target={'_blank'}
          href={`https://www.moneyhelper.org.ukpensions-and-retirement/taking-your-pension/early-retirement-because-of-illness-sickness-or-disability`}
        >
          {' '}
          {z({
            en: 'Ill-health retirement: early medical retirement.',
            cy: 'Ymddeoliad iechyd gwael: ymddeoliad cynnar ar sail meddygol',
          })}
        </Link>
      </Paragraph>
      <Paragraph>
        <span className="font-bold">
          {z({
            en: 'If you’re struggling with your mental health',
            cy: "Os ydych chi'n cael trafferth gyda'ch iechyd meddwl",
          })}
        </span>
        , {z({ en: 'please check out', cy: 'edrychwch ar' })}{' '}
        <Link
          target={'_blank'}
          href={`https://www.moneyhelper.org.ukeveryday-money/budgeting/money-problems-and-poor-mental-wellbeing`}
        >
          {' '}
          {z({
            en: 'Money problems and mental wellbeing.',
            cy: 'Broblemau arian a lles meddyliol gwael.',
          })}
        </Link>
      </Paragraph>
    </>
  );
};

const MidLifeMotLanding = ({ lang, isEmbed }: Props) => {
  const { z } = useTranslation();

  return (
    <Landing
      intro={z({
        en: 'The Money Midlife MOT is a tool to help you assess your current financial situation and plan for the future. Your personalised report will tell you what to prioritise and link to guidance on how to improve your financial wellbeing from mid-life through to retirement.',
        cy: "Teclyn yw MOT Canol Oes Arian i'ch helpu i asesu eich sefyllfa ariannol bresennol a chynllunio ar gyfer y dyfodol. Bydd eich adroddiad personol yn dweud wrthych beth i'w flaenoriaethu ac yn cysylltu â chanllawiau ar sut i wella eich lles ariannol o ganol oes hyd at ymddeoliad.",
      })}
      content={<LandingContent />}
      actionLink={`/${lang}/mid-life-mot/question-1${addEmbedQuery(
        !!isEmbed,
        '?',
      )}`}
      actionText={z({
        en: 'Start your Money Midlife MOT',
        cy: 'Dechreuwch eich MOT Canol Oes Arian',
      })}
    />
  );
};

export default MidLifeMotLanding;
