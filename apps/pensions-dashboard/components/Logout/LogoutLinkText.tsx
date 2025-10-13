import FocusTrap from 'focus-trap-react';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { LogoutDialog } from './LogoutDialog';
import { LogoutLink } from './LogoutLink';
import { useLogoutHandler } from './useLogoutHandler';

export type LogoutLinkTextProps = {
  text: string;
  testId?: string;
  className?: string;
};

export const LogoutLinkText = ({
  text,
  testId = 'logout-link',
  className = 'md:inline',
}: LogoutLinkTextProps) => {
  const { locale } = useTranslation();
  const { isLogoutModalOpen, setIsLogoutModalOpen, handleLogout } =
    useLogoutHandler();

  return (
    <FocusTrap
      active={isLogoutModalOpen}
      focusTrapOptions={{ escapeDeactivates: false, initialFocus: false }}
    >
      <span>
        <LogoutLink
          href={`/${locale}/you-are-about-to-leave`}
          onClick={handleLogout}
          onKeyDown={handleLogout}
          testId={testId}
          className={className}
        >
          {text}
        </LogoutLink>
        {isLogoutModalOpen && (
          <LogoutDialog
            isLogoutModalOpen={isLogoutModalOpen}
            setIsLogoutModalOpen={setIsLogoutModalOpen}
            testId={`${testId}-dialog`}
          />
        )}
      </span>
    </FocusTrap>
  );
};
