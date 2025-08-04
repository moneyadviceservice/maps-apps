import { useEffect, useState } from 'react';

import Link from 'next/link';

import { Button } from '@maps-react/common/components/Button';
import { Paragraph } from '@maps-react/common/components/Paragraph';

import { buttonClassName } from '../../lib/constants/styles/tabs.const';
import { useTabNavigation } from '../../lib/hooks/useTabNavigation';
import { TabContentExampleProps } from '../../lib/types/tabs.type';
import { VisibleSection } from '../VisibleSection/VisibleSection';
/* This component has been created for testing reusable tab functionality. Will be removed when we start the development*/

export const Tab3ChildComponent: React.FC<TabContentExampleProps> = ({
  onEnableNext,
  nextTabId,
}) => {
  const [isJsEnabled, setIsJsEnabled] = useState(false);
  const { onNextClick } = useTabNavigation(nextTabId, onEnableNext);

  useEffect(() => {
    setIsJsEnabled(true);
  }, []);

  return (
    <>
      <Paragraph>This is Step 3 content.</Paragraph>
      <VisibleSection visible={isJsEnabled}>
        <Button
          className={buttonClassName}
          variant="link"
          id="submit"
          name="reSubmit"
          value="true"
          onClick={onNextClick}
        >
          Continue
        </Button>
      </VisibleSection>
      <VisibleSection visible={!isJsEnabled}>
        <Link
          href={`/?tab=${nextTabId}`}
          onClick={onNextClick}
          className={buttonClassName}
        >
          Continue
        </Link>
      </VisibleSection>
    </>
  );
};
