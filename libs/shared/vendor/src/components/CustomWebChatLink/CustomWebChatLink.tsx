import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Button } from '@maps-react/common/components/Button';
import { useTranslation } from '@maps-react/hooks/useTranslation';

declare const Genesys: any;

export type CustomWebChatLinkProps = {
  testId?: string;
  className?: string;
};

export const CustomWebChatLink = ({
  testId = 'custom-web-chat-link',
  className,
}: CustomWebChatLinkProps) => {
  const [webChatIsOpen, setWebChatIsOpen] = useState(false);
  const [webChatIsLoaded, setWebChatIsLoaded] = useState(false);
  const { z } = useTranslation();
  const label =
    (webChatIsOpen
      ? z({ en: 'Close', cy: 'Cau' })
      : z({ en: 'Start', cy: 'Dechrau' })) +
    ' ' +
    z({ en: 'webchat', cy: 'gwesgwrs' });

  const toggleMessenger = () => {
    Genesys('command', 'Messenger.open', {}, null, function () {
      Genesys('command', 'Messenger.close');
    });
    setWebChatIsOpen(!webChatIsOpen);
  };

  const checkGenesysLoaded = (attemptCount: number) => {
    const genesys = document.getElementById('genesys-mxg-frame');
    if (genesys) {
      setWebChatIsLoaded(true);
      Genesys('subscribe', 'Messenger.opened', () => {
        setWebChatIsOpen(true);
      });

      Genesys('subscribe', 'Messenger.closed', () => {
        setWebChatIsOpen(false);
      });
    } else if (attemptCount < 4) {
      setTimeout(() => checkGenesysLoaded(attemptCount + 1), 500);
    }
  };

  useEffect(() => {
    checkGenesysLoaded(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    webChatIsLoaded && (
      <Button
        data-testid={testId}
        variant={webChatIsOpen ? 'secondary' : 'primary'}
        className={twMerge(`!gap-0 w-full`, className)}
        onClick={() => toggleMessenger()}
        type="button"
      >
        {label}
      </Button>
    )
  );
};
