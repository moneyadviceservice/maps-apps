import { useState } from 'react';

import { UserData } from 'types/Users';
import { v4 } from 'uuid';

import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { Container } from '@maps-react/core/components/Container';

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'N/A';

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

type Props = {
  users: UserData[];
  loading?: boolean;
  error?: string | null;
};

export const RegisteredUsers = ({ users, loading, error }: Props) => {
  const [sortAsc, setSortAsc] = useState(true);

  const sortedUsers = [...users].sort((a, b) => {
    const nameA = a.givenName?.toLowerCase() ?? '';
    const nameB = b.givenName?.toLowerCase() ?? '';

    return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  });

  const toggleSort = () => setSortAsc((prev) => !prev);

  if (loading) {
    return (
      <Container className="p-0 mb-8 overflow-hidden border rounded-md t-refine-search border-slate-300">
        <div className="w-full px-6 py-3 border-b bg-slate-200 lg:grid lg:grid-cols-2 border-slate-300">
          Registered Users
        </div>
        <div className="p-6 text-center">Loading registered users...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="p-0 mb-8 overflow-hidden border rounded-md t-refine-search border-slate-300">
        <div className="w-full px-6 py-3 border-b bg-slate-200 lg:grid lg:grid-cols-2 border-slate-300">
          Registered Users
        </div>
        <div className="p-6 text-center text-red-600">Error: {error}</div>
      </Container>
    );
  }

  return (
    <Container className="p-0 mb-8 overflow-hidden border rounded-md t-refine-search border-slate-300">
      <div className="w-full px-6 py-3 border-b bg-slate-200 lg:grid lg:grid-cols-2 border-slate-300">
        Registered Users
      </div>

      <div className="overflow-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-300">
              <th
                className="px-4 py-2 font-medium cursor-pointer"
                onClick={toggleSort}
              >
                <div className="flex items-center gap-1">
                  First name{' '}
                  {sortAsc ? (
                    <Icon type={IconType.CHEVRON_DOWN} className="w-4" />
                  ) : (
                    <Icon
                      type={IconType.CHEVRON_DOWN}
                      className="w-4 rotate-180"
                    />
                  )}
                </div>
              </th>
              <th className="px-4 py-2 font-medium">Last name</th>
              <th className="px-4 py-2 font-medium">Email</th>
              <th className="px-4 py-2 font-medium">Job title</th>
              <th className="px-4 py-2 font-medium">Join date</th>
              <th className="px-4 py-2 font-medium">Last login</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers?.length ? (
              sortedUsers.map((user) => (
                <tr
                  key={user.id || user.userPrincipalName || v4()}
                  className={`odd:bg-gray-50
                   border-b border-gray-200`}
                >
                  <td
                    data-testid="user-first-name"
                    className="px-4 py-2 font-bold"
                  >
                    {user.givenName}
                  </td>
                  <td
                    data-testid="user-last-name"
                    className="px-4 py-2 font-bold"
                  >
                    {user.surname}
                  </td>
                  <td
                    data-testid="user-email"
                    className="px-4 py-2 text-blue-600 underline"
                  >
                    <Link href={`mailto:${user.userPrincipalName}`}>
                      {user.mail}
                    </Link>
                  </td>
                  <td data-testid="user-job-title" className="px-4 py-2">
                    {user.jobTitle}
                  </td>
                  <td data-testid="user-join-date" className="px-4 py-2">
                    {formatDate(user.createdDateTime)}
                  </td>
                  <td data-testid="user-last-login" className="px-4 py-2">
                    {formatDate(
                      user.signInActivity?.lastSuccessfulSignInDateTime,
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                  No registered users found for this organization.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Container>
  );
};
