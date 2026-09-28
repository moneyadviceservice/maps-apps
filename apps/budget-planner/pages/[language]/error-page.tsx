import { GetServerSideProps } from 'next';

import { H2 } from '@maps-react/common/components/Heading';
import useLanguage from '@maps-react/hooks/useLanguage';
import useTranslation from '@maps-react/hooks/useTranslation';

import { BudgetPlannerPageWrapper } from '.';

const ErrorPage = ({ isEmbedded }: { isEmbedded: boolean }) => {
  const { z } = useTranslation();
  const lang = useLanguage();

  return (
    <BudgetPlannerPageWrapper
      title={z({ en: 'Budget Planner', cy: 'Cynlluniwr Cyllideb' })}
      isEmbedded={isEmbedded}
    >
      <div className="max-w-[840px] space-y-8">
        <H2>
          {' '}
          {z({
            en: `We're sorry, something went wrong`,
            cy: `Mae'n ddrwg gennym, aeth rhywbeth o'i le`,
          })}
        </H2>
        <p>
          {z({
            en: `An unexpected error occurred while saving your data. We're sorry
          for the inconvenience and appreciate your patience. Please try again
          later.`,
            cy: `Digwyddodd gwall annisgwyl wrth arbed eich data. Mae'n ddrwg gennym am yr anghyfleuster ac rydym yn gwerthfawrogi eich amynedd. Ceisiwch eto yn nes ymlaen. `,
          })}
        </p>
        <p>
          {z({
            en: `If you're still having issues, you can `,
            cy: `Os ydych chi'n dal i gael problemau, gallwch `,
          })}
          <a
            href={`https://www.moneyhelper.org.uk/${lang}/contact-us`}
            target="_blank"
            rel="noreferrer"
            className="text-magenta-500 underline"
          >
            {z({
              en: 'contact us',
              cy: 'gysylltu â ni',
            })}
          </a>{' '}
          {z({
            en: 'for support.',
            cy: 'am gefnogaeth.',
          })}
        </p>
      </div>
    </BudgetPlannerPageWrapper>
  );
};

export default ErrorPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const isEmbed = query.isEmbedded === 'true';

  return {
    props: {
      isEmbedded: isEmbed,
    },
  };
};
