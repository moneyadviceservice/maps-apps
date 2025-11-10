import { GetServerSideProps } from 'next';

import { RetirementPlannerWrapper } from 'layout/RetirementPlannerWrapper';

import { H2 } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Container } from '@maps-react/core/components/Container';
import useTranslation from '@maps-react/hooks/useTranslation';

import { getServerSideDefaultProps } from '.';

type Props = {
  isEmbedded: boolean;
  pageTitle: string;
  title: string;
  sessionId: string;
};

const ErrorPage = ({
  isEmbedded = false,
  pageTitle,
  title,
  sessionId,
}: Props) => {
  const { t } = useTranslation();
  return (
    <RetirementPlannerWrapper
      isEmbedded={isEmbedded}
      pageTitle={pageTitle}
      title={title}
    >
      <Container>
        <div className="max-w-[840px] space-y-8">
          <H2>{t('errorPage.title')}</H2>
          <Paragraph>
            {t('errorPage.description')}{' '}
            <Link href={'/retirement-budget-planner/about-you'}>
              {' '}
              {t('errorPage.aboutYouLink.text')}
            </Link>
          </Paragraph>
          <Paragraph>
            {t('errorPage.contact.description')}{' '}
            <Link href={'https://www.moneyhelper.org.uk/en/contact-us'}>
              {t('errorPage.contact.contactLink.start')}
            </Link>
            {t('errorPage.contact.contactLink.end')}
          </Paragraph>
        </div>
      </Container>
    </RetirementPlannerWrapper>
  );
};

export default ErrorPage;

export const getServerSideProps: GetServerSideProps = getServerSideDefaultProps;
