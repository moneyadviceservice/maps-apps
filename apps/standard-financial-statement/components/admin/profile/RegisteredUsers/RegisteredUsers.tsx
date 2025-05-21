import { useState } from 'react';

import { v4 } from 'uuid';

import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { Container } from '@maps-react/core/components/Container';

import { Organisation } from '../../../../types/Organisations';

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
  data: Organisation;
};

export const RegisteredUsers = ({ data }: Props) => {
  const [sortAsc, setSortAsc] = useState(true);

  const sortedUsers = [...(data?.users ?? [])].sort((a, b) => {
    const nameA = a.first_name?.toLowerCase() ?? '';
    const nameB = b.first_name?.toLowerCase() ?? '';
    return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  });

  const toggleSort = () => setSortAsc((prev) => !prev);

  return (
    <Container className="overflow-hidden border rounded-md t-refine-search border-slate-300 mb-8 p-0">
      <div className=" w-full px-6 py-3 bg-slate-200 lg:grid lg:grid-cols-2 border-b border-slate-300">
        Registered Users
      </div>

      <div className="overflow-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-300 text-left">
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
                  key={v4()}
                  className={`odd:bg-gray-50
                   border-b border-gray-200`}
                >
                  <td
                    data-testid="user-first-name"
                    className="px-4 py-2 font-bold"
                  >
                    {user.first_name}
                  </td>
                  <td
                    data-testid="user-last-name"
                    className="px-4 py-2 font-bold"
                  >
                    {user.last_name}
                  </td>
                  <td
                    data-testid="user-email"
                    className="px-4 py-2 underline text-blue-600"
                  >
                    <Link href={`mailto:${user.email}`}>{user.email}</Link>
                  </td>
                  <td data-testid="user-job-title" className="px-4 py-2">
                    {user.job_title}
                  </td>
                  <td data-testid="user-join-date" className="px-4 py-2">
                    {formatDate(user.join_date)}
                  </td>
                  <td data-testid="user-last-login" className="px-4 py-2">
                    {formatDate(user.last_login)}
                  </td>
                </tr>
              ))
            ) : (
              <tr key={v4()}>
                <td className="px-4 py-2 font-bold">Test</td>
                <td className="px-4 py-2 font-bold">User</td>
                <td className="px-4 py-2 underline text-blue-600">
                  <Link href={`mailto:example@email.com`}>
                    example@email.com
                  </Link>
                </td>
                <td className="px-4 py-2">Developer</td>
                <td className="px-4 py-2">2 Mar 2024</td>
                <td className="px-4 py-2">3 Apr 2025</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Container>
  );
};
