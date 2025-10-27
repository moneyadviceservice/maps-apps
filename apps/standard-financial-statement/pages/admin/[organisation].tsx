import { useEffect, useMemo, useState } from 'react';

import { GetServerSideProps } from 'next';

import { EllipsisMenu } from 'components/admin/EllipsisMenu';
import { CoverageAreas } from 'components/admin/profile/CoverageAreas';
import { ManageLicence } from 'components/admin/profile/ManageLicence';
import { Memberships } from 'components/admin/profile/Memberships';
import { OrganisationDetails } from 'components/admin/profile/OrganisationDetails';
import { RegisteredUsers } from 'components/admin/profile/RegisteredUsers';
import { Usage } from 'components/admin/profile/Usage';
import { ToggleEditProvider, useEditMode } from 'contexts/EditModeContext';
import { AdminPageLayout } from 'layouts/AdminPageLayout';
import { getAdminSession } from 'lib/auth/sessionManagement/getAdminSession';
import { getOrganisation } from 'lib/organisations';
import { twMerge } from 'tailwind-merge';
import { AdminSettings } from 'types/@adobe/site-settings';
import { AdminUser } from 'types/admin/base';
import { Organisation } from 'types/Organisations';
import { UserData } from 'types/Users';
import { fetchSiteSettings } from 'utils/fetch';

import { Button } from '@maps-react/common/components/Button';
import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Container } from '@maps-react/core/components/Container';

const crumbs = [
  { label: '', link: '' },
  { label: 'Back to all members', link: '/admin/dashboard' },
];

type ProfileProps = {
  data: Organisation;
};

const Profile = ({ data }: ProfileProps) => {
  const { isEditMode, handleCancel } = useEditMode();
  const [fetchedUsers, setFetchedUsers] = useState<UserData[]>([]);
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const editActionButtons = useMemo(
    () => (
      <div className="flex gap-4">
        <Button type="submit">Save changes</Button>
        <Button onClick={handleCancel} variant="secondary">
          Cancel
        </Button>
      </div>
    ),
    [handleCancel],
  );

  const pageHeading = useMemo(
    () => (isEditMode ? 'Edit organisation profile' : data?.name),
    [isEditMode, data?.name],
  );

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      const usersArray = data.users;

      if (!usersArray || usersArray.length === 0 || !usersArray[0]?.email) {
        setLoading(false);
        setFetchedUsers([]);
        return;
      }

      try {
        const response = await fetch(`/api/users/fetch`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ users: usersArray }),
        });

        const result = await response.json();

        if (response.ok) {
          setFetchedUsers(result.users);
          setFirstName(result.users[0]?.givenName ?? '');
        } else {
          console.error(
            'Failed to fetch users:',
            result.message,
            result.details,
          );
          setError(
            result.message ?? 'An unknown error occurred during user fetching.',
          );
          setFetchedUsers([]);
        }
      } catch (err) {
        console.error('Network or unexpected error during fetch:', err);
        setError((err as Error).message ?? 'Failed to connect to the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [data.users]);

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Heading
            component={'h1'}
            className="font-semibold text-blue-700 md:!text-5xl"
          >
            {pageHeading}
          </Heading>
          {!isEditMode && (
            <Paragraph className="mb-0 text-2xl">{data?.type?.title}</Paragraph>
          )}
        </div>
        <div className="flex justify-end">
          {isEditMode ? editActionButtons : <EllipsisMenu data={data} />}
        </div>
      </div>

      {!isEditMode && (
        <ManageLicence data={data} firstName={firstName} users={fetchedUsers} />
      )}

      <OrganisationDetails data={data} isEditMode={isEditMode} />

      <Container
        className={twMerge(
          'flex p-0 mb-8 flex-col',
          isEditMode ? 'gap-8 ' : 'md:flex-row justify-between gap-6 p-0 ',
        )}
      >
        <div
          className={twMerge(
            !isEditMode && 'md:w-1/2',
            'w-full border rounded-md border-slate-300',
          )}
        >
          <Usage data={data} isEditMode={isEditMode} />
        </div>
        <div
          className={twMerge(
            !isEditMode && 'md:w-1/2',
            'w-full border rounded-md border-slate-300',
          )}
        >
          <Memberships data={data} isEditMode={isEditMode} />
        </div>
      </Container>

      <CoverageAreas data={data} isEditMode={isEditMode} />

      {isEditMode ? (
        editActionButtons
      ) : (
        <RegisteredUsers users={fetchedUsers} loading={loading} error={error} />
      )}
    </>
  );
};

type Props = {
  siteConfig: AdminSettings;
  assetPath: string;
  user: AdminUser;
  data: Organisation;
};

const Page = ({ siteConfig, assetPath, user, data }: Props) => {
  return (
    <AdminPageLayout
      siteConfig={siteConfig}
      assetPath={assetPath}
      pageTitle={'Admin'}
      user={user}
      crumbs={crumbs}
    >
      <ToggleEditProvider licence_number={String(data.licence_number)}>
        <Profile data={data} />
      </ToggleEditProvider>
    </AdminPageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const lang = 'en';

  const { params } = context;

  const requireAdmin = true;
  const session = await getAdminSession(context, requireAdmin);

  if ('redirect' in session) {
    return session;
  }

  const user = {
    name: session?.name,
    email: session?.username,
  };

  const licenceNumber = Array.isArray(params?.organisation)
    ? params.organisation[0]
    : params?.organisation ?? '';

  const siteConfig = await fetchSiteSettings(lang);

  const data = await getOrganisation(parseInt(licenceNumber));

  return {
    props: {
      siteConfig: siteConfig ?? {},
      assetPath: process.env.AEM_HOST_PUBLIC ?? '',
      user,
      data,
    },
  };
};
