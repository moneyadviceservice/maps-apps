import { useState } from 'react';

import { Button } from '@maps-react/common/components/Button';

import { Action, EmailData } from '../../../../../types/admin/base';
import { Organisation } from '../../../../../types/Organisations';
import { Modal } from '../../../../Modal';
import { ActionModalContent } from '../ActionModalContent';

type Props = {
  data: Organisation;
  updateStatus: (action: Action) => void;
};

export const ActionButtons = ({ data, updateStatus }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [action, setAction] = useState<Action>('pending');
  const [error, setError] = useState<string>();

  const handleClick = (action: Action) => {
    setAction(action);
    setModalOpen(true);
  };

  const handleConfirm = async (
    emailData?: EmailData,
    additionalEmailCopy?: string,
  ) => {
    const cosmosUpdataParams = {
      licence_number: data.licence_number,
      action: action,
    };

    try {
      await fetch(`/api/update-licence-status`, {
        method: 'PUT',
        body: JSON.stringify(cosmosUpdataParams),
      });
    } catch (err) {
      setError((err as Error).message);

      return err;
    }

    if (emailData?.notifyWithEmail && data.email) {
      try {
        const queryParams = {
          email: data.email,
          organisation_name: data.name,
          emailContent: emailData.emailContent,
          additionalEmailContent:
            emailData.additionalLabel &&
            `${emailData.additionalLabel} ${additionalEmailCopy}`,
        };
        await fetch(`/api/notify-org-status-change`, {
          method: 'post',
          body: JSON.stringify(queryParams),
        });
      } catch (err) {
        setError((err as Error).message);

        return err;
      }
    } else {
      setError('No primary email attached to the company');

      return 'No primary email attached to the company';
    }

    updateStatus(action);
    setModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        <Button
          variant="secondary"
          onClick={() => handleClick('approve')}
          data-testid="approve-button"
        >
          Approve
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleClick('decline')}
          data-testid="decline-button"
        >
          Decline
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleClick('requestMoreInfo')}
          data-testid="more-info-button"
        >
          Request more information
        </Button>
      </div>

      {action && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          data-testid="modal-container"
        >
          <ActionModalContent
            action={action}
            orgName={data.name}
            onCancel={() => setModalOpen(false)}
            onConfirm={handleConfirm}
            error={error}
          />
        </Modal>
      )}
    </>
  );
};
