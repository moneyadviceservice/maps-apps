import { GetServerSideProps } from 'next';

import { H2 } from '@maps-react/common/components/Heading';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { BudgetPlannerPageWrapper } from '.';

const ErrorPage = ({ isEmbedded }: { isEmbedded: boolean }) => {
  const { t } = useTranslation();

  return (
    <BudgetPlannerPageWrapper title={t('site.title')} isEmbedded={isEmbedded}>
      <div className="max-w-[840px] space-y-8">
        <H2> {t('pages.error-page.heading')}</H2>
        <p>{t('pages.error-page.text')}</p>
        <Markdown
          content={t('pages.error-page.contact')}
          className="mb-0"
          withIcon={false}
        />
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
