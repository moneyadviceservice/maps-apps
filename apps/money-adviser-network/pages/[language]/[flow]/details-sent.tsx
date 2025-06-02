import { LastPageWrapper } from 'components/LastPageWrapper';
import { PAGES } from 'CONSTANTS';
import { MANAnalytics } from 'data/analytics/analytics';
import { getCurrentPath } from 'utils/getCurrentPath';

import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Analytics } from '@maps-react/core/components/Analytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { BaseProps, getServerSidePropsDefault, MoneyAdviserNetwork } from '../';

const DetailsSent = ({
  lang,
  cookieData,
  currentFlow,
  userId,
  storedData,
}: BaseProps) => {
  const { z } = useTranslation();

  const heading = z({
    en: 'Details have been sent',
    cy: "Mae manylion wedi'u hanfon",
  });

  const email = cookieData?.customerDetails?.email ?? '';

  const stepData = {
    pageName: `details-sent`,
    pageTitle: heading,
    stepName: 'Details have been sent',
  };

  return (
    <MoneyAdviserNetwork step="refer">
      <Analytics
        analyticsData={MANAnalytics(z, 5, stepData, currentFlow, userId)}
        currentStep={5}
        formData={storedData}
        lastStep={5}
      >
        <LastPageWrapper
          heading={heading}
          lang={lang}
          backLink={`/${lang}/${getCurrentPath(currentFlow)}/${
            PAGES.CONFIRM_ANSWERS
          }`}
        >
          <Paragraph>
            {z({
              en: `Advise the customer that they will receive an email to ${email} within 10 minutes with a link and details of the online debt advice service.`,
              cy: `Rhowch wybod i'r cwsmer y bydd yn derbyn yr e-bost i ${email} o fewn 10 munud gyda dolen a manylion y gwasanaeth cyngor ar ddyledion ar-lein.`,
            })}
          </Paragraph>
        </LastPageWrapper>
      </Analytics>
    </MoneyAdviserNetwork>
  );
};

export default DetailsSent;

export const getServerSideProps = getServerSidePropsDefault;
