import { LastPageWrapper } from 'components/LastPageWrapper';

import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { BaseProps, getServerSidePropsDefault, MoneyAdviserNetwork } from '../';

const CallConfirmation = ({ links }: BaseProps) => {
  const { z } = useTranslation();
  const backLink = links.question.goToQuestionOne;
  const heading = z({
    en: 'Customer will receive a call now from 0800 138 8293',
    cy: 'Bydd cwsmeriaid yn derbyn galwad nawr gan 0800 138 8293',
  });

  return (
    <MoneyAdviserNetwork step="refer">
      <LastPageWrapper heading={heading} backLink={backLink}>
        <Paragraph className="mt-6 text-[18px]">
          {z({
            en: 'Please end your call now.',
            cy: 'Gorffennwch eich galwad nawr.',
          })}
        </Paragraph>
      </LastPageWrapper>
    </MoneyAdviserNetwork>
  );
};

export default CallConfirmation;

export const getServerSideProps = getServerSidePropsDefault;
