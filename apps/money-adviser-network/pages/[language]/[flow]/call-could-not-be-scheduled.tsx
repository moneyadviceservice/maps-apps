import { LastPageWrapper } from 'components/LastPageWrapper';
import { PATHS } from 'CONSTANTS';
import { MANAnalytics } from 'data/analytics/analytics';
import { isInOfficeHours } from 'utils/isInOfficeHours';

import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Analytics } from '@maps-react/core/components/Analytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { BaseProps, getServerSidePropsDefault, MoneyAdviserNetwork } from '../';

const CallConfirmation = ({
  lang,
  cookieData,
  storedData,
  currentFlow,
  referrerId,
}: BaseProps) => {
  const { z } = useTranslation();
  const useImmediateCallbackCopy = cookieData?.whenToSpeak?.value === '0';

  const heading = useImmediateCallbackCopy
    ? z({
        en: 'Service not available',
        cy: "Nid yw'r gwasanaeth ar gael",
      })
    : z({
        en: 'Call could not be scheduled',
        cy: 'Nid oedd modd trefnu galwad',
      });

  const stepData = {
    pageName: `call-confirmation`,
    pageTitle: heading,
    stepName: useImmediateCallbackCopy
      ? 'Service not available'
      : 'Call could not be scheduled',
  };

  return (
    <MoneyAdviserNetwork step="callCouldNotBeScheduled">
      <Analytics
        analyticsData={MANAnalytics(z, 11, stepData, currentFlow, referrerId)}
        currentStep={11}
        formData={storedData}
        lastStep={11}
      >
        <LastPageWrapper heading={heading} lang={lang}>
          {useImmediateCallbackCopy ? (
            <Paragraph className="my-4">
              {z({
                en: 'The immediate call back service is only available on Monday - Friday between 9.00am and 3.30pm.',
                cy: 'Mae&apos;r gwasanaeth galw yn ôl ar unwaith ond ar gael o ddydd Llun i ddydd Gwener rhwng 9.00am a 3.30pm.',
              })}
            </Paragraph>
          ) : (
            <Paragraph className="mt-6">
              {z({
                en: 'The time slot you selected has been taken and there are no other time slots available over the next 4 days.',
                cy: "Mae'r slot amser dewisoch wedi cael ei lenwi ac nid oes unrhyw slotiau amser eraill ar gael am y 4 diwrnod nesaf.",
              })}
            </Paragraph>
          )}
          <Paragraph className="font-bold">
            {z({
              en: 'Pick a different method of referral:',
              cy: 'Dewiswch ddull cyfeirio arall:',
            })}
          </Paragraph>
          <Paragraph>
            <Link href={`/${lang}/${PATHS.START}/q-4?q-1=1&q-2=0&q-3=1`}>
              {z({
                en: 'Go back to choose another referral method',
                cy: 'Ewch yn ôl i ddewis dull cyfeirio arall',
              })}
            </Link>
            <span>
              {isInOfficeHours()
                ? z({
                    en: ', this could be online, face-to-face or to have an immediate call back on the telephone.',
                    cy: ', gallai hwn fod ar-lein, wyneb yn wyneb, neu ffonio yn ôl yn syth.',
                  })
                : z({
                    en: ', this could be online or face-to-face.',
                    cy: ', gallai hwn fod ar-lein neu wyneb yn wyneb.',
                  })}
            </span>
          </Paragraph>
        </LastPageWrapper>
      </Analytics>
    </MoneyAdviserNetwork>
  );
};

export default CallConfirmation;

export const getServerSideProps = getServerSidePropsDefault;
