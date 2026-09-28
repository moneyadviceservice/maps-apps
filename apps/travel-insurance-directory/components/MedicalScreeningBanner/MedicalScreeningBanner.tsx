import { firmSummary } from 'data/components/firmSummary/firmSummary';

import {
  NotificationBox,
  NotificationBoxVariant,
} from '@maps-react/common/components/NotificationBox';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export const MedicalScreeningBanner = () => {
  const { z } = useTranslation();

  return (
    <NotificationBox
      variant={NotificationBoxVariant.WARNING}
      testId="medical-screening-banner"
      className="my-6 max-w-[948px]"
    >
      <Paragraph className="text-gray-800 text-[18px] m-0">
        {firmSummary.medicalScreening.description(z)}
      </Paragraph>
    </NotificationBox>
  );
};
