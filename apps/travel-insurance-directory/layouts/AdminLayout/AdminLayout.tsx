import { ReactNode } from 'react';

import { AdminFooter } from 'components/AdminFooter';
import { AdminHeader } from 'components/AdminHeader';

export type AdminLayoutProps = {
  children: ReactNode;
  showSignOut?: boolean;
  userName?: string;
  userEmail?: string;
};

export const AdminLayout = ({
  children,
  showSignOut,
  userName,
  userEmail,
}: AdminLayoutProps) => (
  <div className="flex flex-col min-h-screen">
    <AdminHeader
      showSignOut={showSignOut}
      userName={userName}
      userEmail={userEmail}
    />
    <main id="main" className="flex-1">
      {children}
    </main>
    <AdminFooter />
  </div>
);
