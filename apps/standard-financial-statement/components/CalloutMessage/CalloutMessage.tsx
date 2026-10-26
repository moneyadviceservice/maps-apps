import { RichTextWrapper } from 'components/RichTextWrapper';

import {
  NotificationBox,
  NotificationBoxVariant,
} from '@maps-react/common/index';

const CalloutMessage = ({ children }: { children: React.ReactNode }) => {
  return (
    <NotificationBox
      variant={NotificationBoxVariant.INFORMATION_BLUE}
      className="pb-10 mt-10 mb-8 lg:px-10"
    >
      <RichTextWrapper className="mt-0 lg:mt-0">{children}</RichTextWrapper>
    </NotificationBox>
  );
};

export default CalloutMessage;
