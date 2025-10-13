import { RichTextWrapper } from 'components/RichTextWrapper';

import { Callout, CalloutVariant } from '@maps-react/common/index';

const CalloutMessage = ({ children }: { children: React.ReactNode }) => {
  return (
    <Callout
      variant={CalloutVariant.INFORMATION_BLUE}
      className="pb-10 mt-10 mb-8 lg:px-10"
    >
      <RichTextWrapper className="mt-0 lg:mt-0">{children}</RichTextWrapper>
    </Callout>
  );
};

export default CalloutMessage;
