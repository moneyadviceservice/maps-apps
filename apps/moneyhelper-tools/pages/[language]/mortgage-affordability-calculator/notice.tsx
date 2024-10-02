import { MortgageAffordability, getServerSidePropsDefault } from '.';
import { ParsedUrlQuery } from 'querystring';
import { convertQueryToUrlSearchParams } from 'utils/convertQueryToUrlSearchParams';
import { BackLink } from 'components/BackLink';
import { MACAnalytics } from 'components/Analytics';
import { FormData } from 'data/types';
import { Container } from '@maps-react/core/components/Container';
import { H1 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Link } from '@maps-react/common/components/Link';
import { useTranslation } from '@maps-react/hooks/useTranslation';

type Props = {
  isEmbed: boolean;
  lang: string;
  urlPath: string;
  query: ParsedUrlQuery;
  formData: FormData;
};

const NoticePage = ({ isEmbed, lang, urlPath, query, formData }: Props) => {
  const { z } = useTranslation();
  const searchParams = convertQueryToUrlSearchParams(query).toString();
  const toolBaseUrl = `/${lang}${urlPath}`;
  const step = 'notice';

  return (
    <MortgageAffordability isEmbed={isEmbed} step={step}>
      <MACAnalytics currentStep={step} formData={formData}>
        <Container className="pb-16">
          <div className="mb-8 -mt-4">
            <BackLink href={`${toolBaseUrl}household-costs?${searchParams}`}>
              {z({ en: 'Back', cy: 'Yn ôl' })}
            </BackLink>
          </div>
          <div className="lg:max-w-[840px] space-y-8]">
            <H1 className="mb-8 md:text-[48px]">
              {z({
                en: 'It appears your budget is overstretched',
                cy: 'Fe ymddengys fod eich cyllideb wedi ei gorymestyn',
              })}
            </H1>
            <Paragraph className="mb-8">
              {z({
                en: "Your monthly committed costs are higher than your take-home pay. Based on the costs you've entered, you won't be offered a mortgage.",
                cy: "Mae eich costau ymroddedig misol yn uwch na'ch cyflog clir. Yn seiliedig ar y costau a roddoch, ni fyddwch yn cael cynnig morgais.",
              })}
            </Paragraph>
            <Paragraph className="font-bold mb-8">
              {z({
                en: 'Please check the numbers you have entered.',
                cy: 'Gwiriwch y rhifau a roddoch.',
              })}
            </Paragraph>
            <Paragraph className="mb-8">
              {z({
                en: 'If you are spending more than your take-home pay, this means that you are overstretching your budget and are at risk of getting into debt.',
                cy: "Os ydych yn gwario mwy na'ch cyflog clir, mae hyn yn golygu eich bod yn gorymestyn eich cyllideb ac mewn perygl o fynd i ddyled.",
              })}
            </Paragraph>
            <div className="flex justify-start flex-col lg:gap-4 md:flex-row my-8">
              <Link
                asButtonVariant="primary"
                type="button"
                href={`${toolBaseUrl}household-costs?${searchParams}`}
                data-testid="landing-page-button"
                className="w-full sm:w-auto"
              >
                {z({ en: 'Back', cy: 'Yn ôl' })}
              </Link>
              <Link
                asButtonVariant="secondary"
                type="button"
                href={`${toolBaseUrl}results?${searchParams}`}
                data-testid="landing-page-button"
                className="w-full sm:w-auto"
              >
                {z({ en: 'Next Steps', cy: 'Camau nesaf' })}
              </Link>
            </div>
          </div>
        </Container>
      </MACAnalytics>
    </MortgageAffordability>
  );
};

export default NoticePage;

export const getServerSideProps = getServerSidePropsDefault;
