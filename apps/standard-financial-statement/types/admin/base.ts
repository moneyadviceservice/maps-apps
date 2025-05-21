import { ReactNode } from 'react';

export interface AdminUser {
  name: string;
  email: string;
}

const actionList = [
  'approve',
  'requestMoreInfo',
  'revoked',
  'decline',
  'delete',
  'pending',
] as const;

export type Action = (typeof actionList)[number];

export interface EmailData {
  emailContent?: string;
  additionalLabel?: string;
  additionalPlaceholder?: string;
  notifyWithEmail?: boolean;
}

export interface ModalContent {
  title: string;
  content: (orgName?: string) => string | ReactNode;
  primaryLabel: string;
  danger: boolean;
  emailData?: EmailData;
}

export type ModalStatusObject = {
  [K in Action]?: ModalContent;
};
