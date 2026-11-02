import { useState } from 'react';

import { H2 } from '@maps-react/common/components/Heading';
import { Container } from '@maps-react/core/components/Container';

import { Action } from '../../../../types/admin/base';
import { Organisation } from '../../../../types/Organisations';
import { UserData } from '../../../../types/Users';
import { getStatusByAction } from '../../../../utils/admin/getStatusByAction';
import { ActionButtons } from './ActionButtons';

type Props = {
  data: Organisation;
  firstName?: string;
  users: UserData[];
};

export const ManageLicence = ({ data, firstName, users }: Props) => {
  const [status, setStatus] = useState<string>(
    data.licence_status ?? 'Pending',
  );

  const getStatusBadgeColor = () => {
    switch (status) {
      case 'active':
        return 'bg-green-200';
      case 'Revoked':
        return 'bg-red-100';
      case 'Declined':
        return 'bg-red-400';
      case 'Pending':
        return 'bg-blue-100';
      case 'Requesting info':
        return 'bg-magenta-800 text-white';
      default:
        return '';
    }
  };

  const updateStatus = (action: Action) => {
    const actionStatus = getStatusByAction(action);

    setStatus(actionStatus);
  };

  const statusBadgeColor = getStatusBadgeColor();
  const displayText = status === 'active' ? 'Approved' : status;

  return (
    <Container className="flex flex-col justify-between gap-6 px-10 py-8 mb-8 bg-gray-150 md:flex-row">
      <section className="w-full md:w-auto">
        <H2 className="text-4xl font-medium !leading-none mb-6">
          Manage licence
        </H2>
        <ActionButtons
          data={data}
          firstName={firstName}
          users={users}
          updateStatus={updateStatus}
        />
      </section>
      <section className="flex w-full md:w-auto gap-8 ml-auto justify-between items-start">
        <dl className="w-full grid gap-4 grid-cols-[repeat(2,minmax(min-content,1fr))]">
          <dt className="col-start-1 row-start-1 break-words">
            Licence Status
          </dt>
          <dd className="col-start-1 row-start-2">
            <span
              data-testid="status-badge"
              className={` ${statusBadgeColor} inline-block text-center rounded-full py-2 px-4`}
            >
              {displayText}
            </span>
          </dd>
          <dt className="col-start-2 row-start-1 break-words">
            Membership number
          </dt>
          <dd
            className="col-start-2 row-start-2 font-bold"
            data-testid="membership-code"
          >
            {status === 'active' ? data.licence_number : ''}
          </dd>
        </dl>
      </section>
    </Container>
  );
};
