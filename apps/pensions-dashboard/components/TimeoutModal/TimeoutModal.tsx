import {
  DialogHTMLAttributes,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react';

import { useRouter } from 'next/router';

import { Button } from '@maps-react/common/components/Button';
import { H2 } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { Dialog } from '../../components/Dialog/Dialog';
import { timeoutTime } from '../../lib/utils/ui';

export type TimeoutModalProps = DialogHTMLAttributes<HTMLDialogElement> & {
  isOpen: boolean;
  onCloseClick: (event: SyntheticEvent) => void;
  modalTimeout: number;
};

export const TimeoutModal = ({
  isOpen,
  onCloseClick,
  modalTimeout,
}: TimeoutModalProps) => {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const [remainingTime, setRemainingTime] = useState(modalTimeout / 1000);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const endTime = Date.now() + modalTimeout;

    setAnnouncement(timeoutTime(Math.floor(modalTimeout / 60000), 0, t));

    const interval = setInterval(() => {
      const timeLeft = Math.max(Math.ceil((endTime - Date.now()) / 1000), 0);
      setRemainingTime(timeLeft);

      if (timeLeft % 30 === 0) {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        setAnnouncement(timeoutTime(minutes, seconds, t));
      }

      if (timeLeft === 0) {
        clearInterval(interval);
        router.push(`/${locale}/your-session-has-expired`);
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, router, locale, modalTimeout]);

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <Dialog
      accessibilityLabelClose={t('common.close')}
      accessibilityLabelReset={t('common.reset')}
      onCloseClick={onCloseClick}
      testId="timeout-dialog"
      isOpen={isOpen}
    >
      <>
        <H2 className="text-blue-700 md:text-5xl">
          {t('timeout.been-inactive')}
        </H2>
        <div className="py-4">
          <Paragraph className="mb-6">
            {t('timeout.modal-session-timeout')}
            <strong>{timeoutTime(minutes, seconds, t)}</strong>.{' '}
            {t('timeout.protect-your-information')}
          </Paragraph>
          <Paragraph>{t('timeout.sign-in-again')}</Paragraph>
        </div>
        <div className="my-6 md:flex">
          <Button
            variant="primary"
            className="block w-full mb-4 text-center md:w-auto md:mr-4 md:inline-flex md:text-left md:mb-0"
            onClick={onCloseClick}
          >
            {t('timeout.keep-me-signed-in')}
          </Button>
          <Link
            asButtonVariant="secondary"
            href={`/${locale}/you-have-exited-the-pensions-dashboard`}
            className="block w-full text-center md:w-auto md:inline-flex md:text-left md:mb-0"
          >
            {t('timeout.log-me-out')}
          </Link>
        </div>
        {/* Live region for screen readers */}
        <div
          data-testid="live-region"
          aria-live="assertive"
          className="sr-only"
        >
          {t('timeout.modal-session-timeout')} {announcement}
        </div>
      </>
    </Dialog>
  );
};
