import { LastPageWrapper } from 'components/LastPageWrapper';
import { MANAnalytics } from 'data/analytics/analytics';

import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Analytics } from '@maps-react/core/components/Analytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { BaseProps, getServerSidePropsDefault, MoneyAdviserNetwork } from '../';

const CallConfirmation = ({
  lang,
  storedData,
  userId,
  currentFlow,
}: BaseProps) => {
  const { z } = useTranslation();
  const heading = z({
    en: 'Customer will receive a call now from 0800 138 8293',
    cy: 'Bydd cwsmeriaid yn derbyn galwad nawr gan 0800 138 8293',
  });

  const stepData = {
    pageName: `call-confirmation`,
    pageTitle: heading,
    stepName: 'Customer will receive a call now from 0800 138 8293',
  };

  return (
    <MoneyAdviserNetwork step="refer">
      <Analytics
        analyticsData={MANAnalytics(z, 11, stepData, currentFlow, userId)}
        currentStep={11}
        formData={storedData}
        lastStep={11}
      >
        <LastPageWrapper heading={heading} lang={lang}>
          <Paragraph className="mt-6 text-[18px]">
            {z({
              en: 'Please end your call now.',
              cy: 'Gorffennwch eich galwad nawr.',
            })}
          </Paragraph>
        </LastPageWrapper>
      </Analytics>
    </MoneyAdviserNetwork>
  );
};

export default CallConfirmation;

export const getServerSideProps = getServerSidePropsDefault;
