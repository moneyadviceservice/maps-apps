import { Button } from '@maps-react/common/components/Button';
import { H2 } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useLanguage from '@maps-react/hooks/useLanguage';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { Dialog } from '../../components/Dialog/Dialog';

type LogoutDialogProps = {
  testId?: string;
  isLogoutModalOpen: boolean;
  setIsLogoutModalOpen: (isOpen: boolean) => void;
};

export const LogoutDialog = ({
  isLogoutModalOpen,
  setIsLogoutModalOpen,
  testId = 'logout-dialog',
}: LogoutDialogProps) => {
  const { t } = useTranslation();
  const language = useLanguage();

  return (
    <Dialog
      accessibilityLabelClose={t('common.close')}
      accessibilityLabelReset={t('common.reset')}
      isOpen={isLogoutModalOpen}
      onCloseClick={() => setIsLogoutModalOpen(false)}
      testId={testId}
    >
      <>
        <H2 className="mb-3 text-blue-700 md:mb-4 md:text-5xl">
          {t('site.logout.about-to-leave')}
        </H2>
        <Paragraph className="mb-6 md:mb-8">
          {t('site.logout.we-will-redirect')}
        </Paragraph>
        <Paragraph>{t('site.logout.are-you-sure')}</Paragraph>
        <div className="mt-10 mb-6 md:flex">
          <Link
            asButtonVariant="primary"
            className="block w-full mb-4 text-center md:mr-4 md:inline-flex md:text-left md:mb-0 md:w-auto"
            href={`/${language}/you-have-exited-the-pensions-dashboard`}
            data-testid="logout-yes"
          >
            {t('site.logout.yes-exit')}
          </Link>
          <Button
            variant="secondary"
            className="w-full md:w-auto"
            onClick={() => setIsLogoutModalOpen(false)}
            data-testid="logout-no"
          >
            {t('common.cancel')}
          </Button>
        </div>
      </>
    </Dialog>
  );
};
