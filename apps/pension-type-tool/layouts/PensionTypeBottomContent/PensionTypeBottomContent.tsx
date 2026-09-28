import { bottomContentText } from 'data/pension-type/bottom-content';

import { H3 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { UrgentCallout } from '@maps-react/common/components/UrgentCallout';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export const PensionTypeBottomContent = () => {
  const { z } = useTranslation();
  const { liveChatLink, urgentCallout } = bottomContentText(z);
  const { heading, content1, content2 } = urgentCallout;

  return (
    <>
      {liveChatLink}
      <div className="lg:max-w-[840px]">
        <UrgentCallout className={'max-w-screen-lg my-9'} variant="arrow">
          <H3>{heading}</H3>
          {content1}
          <Paragraph>{content2}</Paragraph>
        </UrgentCallout>
      </div>
    </>
  );
};
