import { ADMIN_SIGN_OUT_URL } from 'lib/auth/routes';

import { Link } from '@maps-react/common/components/Link';
import { Container } from '@maps-react/core/components/Container';

export type AdminHeaderProps = {
  showSignOut?: boolean;
  userName?: string;
  userEmail?: string;
};

export const AdminHeader = ({
  showSignOut = true,
  userName,
  userEmail,
}: AdminHeaderProps) => (
  <header className="bg-blue-600 print:hidden" data-testid="admin-header">
    <Container className="flex items-center justify-between py-4">
      <Link
        href="/admin/dashboard"
        className="text-xl font-bold text-white visited:text-white hover:text-green-300 hover:no-underline no-underline"
      >
        Travel Insurance Directory
      </Link>
      {showSignOut && (
        <div className="flex items-center gap-4">
          {userName && (
            <span className="text-sm text-white" data-testid="admin-user-info">
              Signed in as{' '}
              <span className="font-bold" data-testid="admin-user-name">
                {userName}
              </span>
              {userEmail && (
                <span data-testid="admin-user-email"> ({userEmail})</span>
              )}
            </span>
          )}
          <Link
            href={ADMIN_SIGN_OUT_URL}
            className="text-sm text-white visited:text-white hover:text-green-300 hover:underline no-underline border border-white rounded px-4 py-1.5"
          >
            Sign out
          </Link>
        </div>
      )}
    </Container>
  </header>
);
