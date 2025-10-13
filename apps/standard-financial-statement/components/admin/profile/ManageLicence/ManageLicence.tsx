import { useState } from 'react';

import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
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
      <div className="w-full md:w-auto">
        <Heading
          component="h2"
          level="h2"
          className="text-4xl font-medium !leading-none mb-6"
        >
          Manage licence
        </Heading>
        <ActionButtons
          data={data}
          firstName={firstName}
          users={users}
          updateStatus={updateStatus}
        />
      </div>
      <div className="flex w-full gap-8 ml-auto text-left md:w-auto lg:gap-16">
        <div>
          <Paragraph>Licence Status</Paragraph>
          <span
            data-testid="status-badge"
            className={`${statusBadgeColor} rounded-full py-2 px-4`}
          >
            {displayText}
          </span>
        </div>
        <div>
          <Paragraph>Membership number</Paragraph>
          <Paragraph className="font-bold" data-testid="membership-code">
            {status === 'active' ? data.licence_number : ''}
          </Paragraph>
        </div>
      </div>
    </Container>
  );
};
