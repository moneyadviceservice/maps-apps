import { bottomContentText } from 'data/pension-type/bottom-content';

import { Callout } from '@maps-react/common/components/Callout';
import { H3 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export const PensionTypeBottomContent = () => {
  const { z } = useTranslation();
  const { liveChatLink, callout } = bottomContentText(z);
  const { heading, content1, content2 } = callout;

  return (
    <>
      {liveChatLink}
      <div className="lg:max-w-[840px]">
        <Callout className={'max-w-screen-lg my-9'} variant="arrow">
          <H3>{heading}</H3>
          {content1}
          <Paragraph>{content2}</Paragraph>
        </Callout>
      </div>
    </>
  );
};
