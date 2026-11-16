import { MACAnalytics } from 'components/Analytics';
import { generateSearchQuery } from 'utils/MortgageAffordabilityCalculator';

import { BackLink } from '@maps-react/common/components/BackLink';
import { H1 } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import {
  NotificationBox,
  NotificationBoxVariant,
} from '@maps-react/common/components/NotificationBox';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { GridContainer } from '@maps-react/core/components/GridContainer';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { FormData } from '@maps-react/pension-tools/types/forms';

import { getServerSidePropsDefault, MortgageAffordability } from '.';

type Props = {
  isEmbed: boolean;
  lang: string;
  formData: FormData;
};

const NoticePage = ({ isEmbed, lang, formData }: Props) => {
  const { z } = useTranslation();
  const searchParams = generateSearchQuery(formData, isEmbed);
  const toolBaseUrl = `/${lang}/`;
  const step = 'notice';

  return (
    <MortgageAffordability isEmbed={isEmbed} step={step}>
      <MACAnalytics currentStep={step} formData={formData}>
        <GridContainer className="pb-16">
          <div className="grid-cols-12 col-span-12 lg:col-span-10 xl:col-span-8">
            <div className="mb-8 -mt-4">
              <BackLink href={`${toolBaseUrl}household-costs?${searchParams}`}>
                {z({ en: 'Back', cy: 'Yn ôl' })}
              </BackLink>
            </div>
            <div className="lg:max-w-[840px]">
              <NotificationBox
                variant={NotificationBoxVariant.WARNING}
                className="mb-8"
              >
                <H1>
                  {z({
                    en: 'It appears your budget is overstretched',
                    cy: 'Fe ymddengys fod eich cyllideb wedi ei gorymestyn',
                  })}
                </H1>
              </NotificationBox>
              <Paragraph className="mb-8">
                {z({
                  en: "Your monthly household costs are higher than your take-home pay. Based on the costs you've entered, you won't be offered a mortgage.",
                  cy: "Mae costau eich cartref bob mis yn uwch na'ch cyflog cymryd adref. Yn seiliedig ar y costau a roddoch, ni fyddwch yn cael cynnig morgais.",
                })}
              </Paragraph>
              <Paragraph className="mb-8 font-bold">
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
              <div className="flex flex-col justify-start my-8 lg:gap-4 md:flex-row">
                <Link
                  asButtonVariant="primary"
                  type="button"
                  href={`${toolBaseUrl}household-costs?${searchParams}`}
                  data-testid="landing-page-button"
                  className="w-full sm:w-auto"
                >
                  {z({ en: 'Back', cy: 'Yn ôl' })}
                </Link>
              </div>
            </div>
          </div>
        </GridContainer>
      </MACAnalytics>
    </MortgageAffordability>
  );
};

export default NoticePage;

export const getServerSideProps = getServerSidePropsDefault;
