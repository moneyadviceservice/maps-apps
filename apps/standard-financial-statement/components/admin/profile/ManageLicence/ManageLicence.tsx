import { useState } from 'react';

import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Container } from '@maps-react/core/components/Container';

import { Action } from '../../../../types/admin/base';
import { Organisation } from '../../../../types/Organisations';
import { getStatusByAction } from '../../../../utils/admin/getStatusByAction';
import { ActionButtons } from './ActionButtons';

type Props = {
  data: Organisation;
};

export const ManageLicence = ({ data }: Props) => {
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
        return 'bg-magenta-700 text-white';
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
    <Container className="bg-gray-300 py-8 px-10 flex flex-col md:flex-row justify-between gap-6 mb-8">
      <div className="w-full md:w-auto">
        <Heading
          component="h2"
          level="h2"
          className="text-4xl font-medium !leading-none mb-6"
        >
          Manage licence
        </Heading>
        <ActionButtons data={data} updateStatus={updateStatus} />
      </div>
      <div className="flex w-full md:w-auto gap-8 lg:gap-16 ml-auto text-left">
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
          <Paragraph>Membership code number</Paragraph>
          <Paragraph className="font-bold" data-testid="membership-code">
            {status === 'active' ? data.licence_number : ''}
          </Paragraph>
        </div>
      </div>
    </Container>
  );
};
