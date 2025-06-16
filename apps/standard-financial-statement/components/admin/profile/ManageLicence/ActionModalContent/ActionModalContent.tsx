import { useState } from 'react';

import { Button } from '@maps-react/common/components/Button';
import { H2 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';

import { modalContent } from '../../../../../data/modal-content/status-change';
import { Action, EmailData } from '../../../../../types/admin/base';

interface ActionModalContentProps {
  action: Action;
  orgName: string;
  onCancel: () => void;
  onConfirm: (emailData?: EmailData, additionalEmailCopy?: string) => void;
  error?: string;
}

export const ActionModalContent = ({
  action,
  orgName,
  onCancel,
  onConfirm,
  error,
}: ActionModalContentProps) => {
  const [additionalCopy, setAdditionalCopy] = useState<string>('');

  const data = modalContent[action];
  if (!data) return <></>;

  const renderEmailCopy = (emailData: EmailData) => (
    <>
      <label
        className="block text-xl font-medium mb-1"
        htmlFor="email-body"
        data-testid="email-body-label"
      >
        Email body text
      </label>
      <Paragraph
        className="text-gray-500 text-md mb-1"
        data-testid="modal-email-content"
      >
        The organisation will receive this information via their email.
      </Paragraph>
      <div className="mb-6 w-full border border-gray-450 rounded p-2">
        <Paragraph>Dear {orgName},</Paragraph>
        {emailData.emailContent && (
          <Paragraph>{emailData.emailContent}</Paragraph>
        )}
        <div className="flex items-center gap-2">
          <label htmlFor="reason">{emailData.additionalLabel} </label>
          <input
            className="flex-1"
            name="reason"
            data-testid="additional-copy"
            value={additionalCopy}
            onChange={(e) => setAdditionalCopy(e.target.value)}
            placeholder={emailData.additionalPlaceholder}
          />
        </div>
      </div>
    </>
  );

  return (
    <>
      <H2 className="text-blue-800 mb-6" data-testid="modal-heading">
        {data.title}
      </H2>

      <Paragraph className="text-xl" data-testid="modal-content">
        {data.content(orgName)}
      </Paragraph>

      {data.emailData?.additionalLabel && renderEmailCopy(data.emailData)}

      {error && (
        <Paragraph
          className="text-red-700"
          data-testid="modal-error"
        >{`Error: ${error}`}</Paragraph>
      )}
      <div className="flex gap-4">
        <Button
          variant="primary"
          onClick={() => onConfirm(data?.emailData, additionalCopy)}
          className={data.danger ? 'bg-red-600 hover:bg-red-700' : ''}
          data-testid="modal-primary-button"
        >
          {data.primaryLabel}
        </Button>
        <Button
          variant="secondary"
          onClick={onCancel}
          data-testid="modal-secondary-button"
        >
          Cancel
        </Button>
      </div>
    </>
  );
};
