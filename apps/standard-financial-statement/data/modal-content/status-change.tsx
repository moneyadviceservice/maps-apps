import { ModalStatusObject } from '../../types/admin/base';

export const modalContent: ModalStatusObject = {
  approve: {
    title: 'Are you sure you want to approve this organisation?',
    content: () => (
      <>
        Please confirm whether you would like to <strong>approve</strong> this
        organisation and give them access to the SFS.
      </>
    ),
    primaryLabel: 'Yes, approve this organisation',
    danger: false,
    emailData: {
      notifyWithEmail: true,
      isApproval: true,
      emailContent:
        'Congratulations, your organisation has been approved to use the SFS.',
    },
  },

  requestMoreInfo: {
    title: 'Request more information',
    content: (orgName) => `You are requesting more information from ${orgName}`,
    primaryLabel: 'Confirm and send',
    danger: false,
    emailData: {
      isApproval: false,
      notifyWithEmail: true,
      additionalLabel:
        'We require additional information in order to process your application. Could you please send the following information to our support at sfs.support@maps.org.uk:',
      additionalPlaceholder: '[insert information needed here]',
    },
  },

  decline: {
    title: 'Decline Licence Application',
    content: (orgName) =>
      `You are declining ${orgName} and they will not be given a licence.`,
    primaryLabel: 'Confirm and send',
    danger: true,
    emailData: {
      isApproval: false,
      notifyWithEmail: true,
      emailContent:
        'We are sorry to inform you that we were unable to approve your application for SFS code membership.',
      additionalLabel: 'This is because',
      additionalPlaceholder: '[insert relevant reason here]',
    },
  },

  delete: {
    title: 'Are you sure you want to delete this organisation?',
    content: () =>
      ' Please confirm whether you would like to delete this organisation. You cannot undo this action.',
    primaryLabel: 'Yes, DELETE this organisation',
    danger: true,
    emailData: {
      notifyWithEmail: false,
    },
  },
};
