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

  useEffect(() => {
    if (!isOpen) return;

    const endTime = Date.now() + modalTimeout;

    const interval = setInterval(() => {
      const timeLeft = Math.max(Math.ceil((endTime - Date.now()) / 1000), 0);
      setRemainingTime(timeLeft);

      if (timeLeft === 0) {
        clearInterval(interval);
        router.push(`/${locale}/your-session-has-expired`);
      }
    }, 1000);

    return () => clearInterval(interval);
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
        <H2 className="text-blue-800 md:text-5xl">
          {t('timeout.been-inactive')}
        </H2>
        <div className="py-4">
          <Paragraph className="mb-6">
            {t('timeout.modal-session-timeout')}
            <strong>
              {minutes > 0 &&
                minutes +
                  ' ' +
                  `${
                    minutes !== 1 ? t('timeout.minutes') : t('timeout.minute')
                  } `}
              {seconds > 0 &&
                seconds +
                  ' ' +
                  `${
                    seconds !== 1 ? t('timeout.seconds') : t('timeout.second')
                  }`}
            </strong>
            . {t('timeout.protect-your-information')}
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
      </>
    </Dialog>
  );
};
