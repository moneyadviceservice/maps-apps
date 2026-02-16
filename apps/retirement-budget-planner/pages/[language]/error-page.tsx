import { GetServerSideProps } from 'next';

import { RetirementPlannerWrapper } from 'layout/RetirementPlannerWrapper';

import { H1 } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { ListElement } from '@maps-react/common/components/ListElement';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Container } from '@maps-react/core/components/Container';
import useTranslation from '@maps-react/hooks/useTranslation';

import { getServerSideDefaultProps } from '.';

type Props = {
  isEmbedded: boolean;
  language: string;
  pageTitle: string;
  title: string;
};

const ErrorPage = ({
  isEmbedded = false,
  pageTitle,
  title,
  language,
}: Props) => {
  const { t } = useTranslation();
  return (
    <RetirementPlannerWrapper
      isEmbedded={isEmbedded}
      pageTitle={pageTitle}
      title={title}
    >
      <Container>
        <div className="max-w-[952px] text-base space-y-9 py-8">
          <H1 className="text-blue-700 mt-9">{t('errorPage.title')}</H1>
          <div>
            <Paragraph className="mb-1">{t('errorPage.description')}</Paragraph>
            <Paragraph className="mb-6">
              {t('errorPage.listOfOptions.description')}
            </Paragraph>
            <ListElement
              variant="unordered"
              color="blue"
              className="ml-8"
              items={[
                <Link key="go-back-to-tool" href={`/${language}/about-you`}>
                  {t('errorPage.listOfOptions.goBackToTool.text')}
                </Link>,
                <>
                  <Link href={'https://www.moneyhelper.org.uk/en/contact-us'}>
                    {t('errorPage.listOfOptions.contactSupport.linkText')}
                  </Link>{' '}
                  {t('errorPage.listOfOptions.contactSupport.rest')}
                </>,
              ]}
            />
          </div>
        </div>
      </Container>
    </RetirementPlannerWrapper>
  );
};

export default ErrorPage;

export const getServerSideProps: GetServerSideProps = getServerSideDefaultProps;
