import { LastPageWrapper } from 'components/LastPageWrapper';
import { MANAnalytics } from 'data/analytics/analytics';

import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Analytics } from '@maps-react/core/components/Analytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { BaseProps, getServerSidePropsDefault, MoneyAdviserNetwork } from '../';

const CallScheduled = ({
  bookingSlot,
  lang,
  storedData,
  referrerId,
}: BaseProps) => {
  const { z } = useTranslation();
  const heading = z({
    en: 'Call scheduled',
    cy: `Galwad wedi'i drefnu`,
  });

  const stepData = {
    pageName: `call-scheduled`,
    pageTitle: heading,
    stepName: 'Call scheduled',
  };

  return (
    <MoneyAdviserNetwork step="callScheduled">
      <Analytics
        analyticsData={MANAnalytics(z, 11, stepData, undefined, referrerId)}
        currentStep={11}
        formData={storedData}
        lastStep={11}
      >
        <LastPageWrapper heading={heading} lang={lang}>
          <Paragraph className="my-6 text-[18px]">
            {z({
              en: 'Customer will receive a call from 0800 138 8293 on:',
              cy: 'Bydd y cwsmer yn derbyn galwad gan 0800 138 8293 ar:',
            })}
          </Paragraph>
          <Paragraph className="font-bold text-[18px]">{bookingSlot}</Paragraph>
          <Paragraph>
            {z({
              en: 'Customer will receive a notification reminder from 0790 867 9667.',
              cy: 'Bydd y cwsmer yn derbyn hysbysiad atgoffa gan 0790 867 9667.',
            })}
          </Paragraph>
        </LastPageWrapper>
      </Analytics>
    </MoneyAdviserNetwork>
  );
};

export default CallScheduled;

export const getServerSideProps = getServerSidePropsDefault;
