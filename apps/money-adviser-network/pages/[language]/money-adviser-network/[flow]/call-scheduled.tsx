import { LastPageWrapper } from 'components/LastPageWrapper';

import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { BaseProps, getServerSidePropsDefault, MoneyAdviserNetwork } from '../';

const CallScheduled = ({ bookingSlot }: BaseProps) => {
  const { z } = useTranslation();
  const heading = z({
    en: 'Call scheduled',
    cy: `Galwad wedi'i drefnu`,
  });

  return (
    <MoneyAdviserNetwork step="refer">
      <LastPageWrapper heading={heading}>
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
    </MoneyAdviserNetwork>
  );
};

export default CallScheduled;

export const getServerSideProps = getServerSidePropsDefault;
