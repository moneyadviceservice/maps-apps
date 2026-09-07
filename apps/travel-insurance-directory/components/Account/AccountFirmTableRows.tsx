import type { ReactNode } from 'react';

import { accountTableLinkClassName } from 'data/pages/account/tradingNames';

import { Link } from '@maps-react/common/components/Link';

import {
  type AccountSectionStatus,
  AccountSectionStatusBadge,
} from './AccountSectionStatusBadge';

const rowLabelClassName =
  'py-3 pr-8 text-left font-semibold text-gray-800 whitespace-nowrap align-top';
const valueCellClassName = 'py-3 text-gray-800';
const valueCellRightClassName = `${valueCellClassName} text-right`;

export type AccountRegisteredNameRowProps = Readonly<{
  registeredNameLabel: string;
  registeredName: string;
  registeredNameHref?: string;
  registeredNameAlign?: 'left' | 'right';
  action?: ReactNode;
}>;

export function AccountRegisteredNameRow({
  registeredNameLabel,
  registeredName,
  registeredNameHref,
  registeredNameAlign = 'right',
  action,
}: AccountRegisteredNameRowProps) {
  const registeredNameCellClassName =
    registeredNameAlign === 'left'
      ? valueCellClassName
      : valueCellRightClassName;

  return (
    <tr className="border-b border-gray-200" data-testid="registered-name-row">
      <th
        scope="row"
        className={rowLabelClassName}
        data-testid="registered-name-label"
      >
        {registeredNameLabel}
      </th>
      <td
        className={registeredNameCellClassName}
        data-testid="registered-name-value"
      >
        {registeredNameHref ? (
          <Link href={registeredNameHref} className={accountTableLinkClassName}>
            {registeredName}
          </Link>
        ) : (
          registeredName
        )}
      </td>
      {action === undefined ? null : (
        <td className="py-3 text-right">{action}</td>
      )}
    </tr>
  );
}

export type AccountFrnRowProps = Readonly<{
  frnLabel: string;
  frn: string;
}>;

export function AccountFrnRow({ frnLabel, frn }: AccountFrnRowProps) {
  return (
    <tr className="border-b border-gray-200" data-testid="frn-row">
      <th scope="row" className={rowLabelClassName} data-testid="frn-label">
        {frnLabel}
      </th>
      <td className={valueCellRightClassName} data-testid="frn-value">
        {frn}
      </td>
    </tr>
  );
}

export type AccountDirectoryStatusRowProps = Readonly<{
  statusLabel: string;
  directoryStatusLabel: string;
  colSpan?: number;
}>;

export function AccountDirectoryStatusRow({
  statusLabel,
  directoryStatusLabel,
  colSpan,
}: AccountDirectoryStatusRowProps) {
  return (
    <tr
      className="border-b border-gray-200"
      data-testid="account-directory-status-row"
    >
      <th
        scope="row"
        className={rowLabelClassName}
        data-testid="account-directory-status-label"
      >
        {statusLabel}
      </th>
      <td
        colSpan={colSpan}
        className={valueCellRightClassName}
        data-testid="account-directory-status-value"
      >
        {directoryStatusLabel}
      </td>
    </tr>
  );
}

export type AccountSectionLinkRowProps = Readonly<{
  sectionLabel: string;
  href: string;
  sectionStatus: AccountSectionStatus;
  colSpan?: number;
}>;

export function AccountSectionLinkRow({
  sectionLabel,
  href,
  sectionStatus,
  colSpan = 2,
}: AccountSectionLinkRowProps) {
  return (
    <tr
      className="border-b border-gray-200"
      data-testid="account-section-link-row"
    >
      <td colSpan={colSpan} className={valueCellClassName}>
        <div className="flex flex-wrap justify-between items-center gap-x-4 gap-y-1">
          <Link
            href={href}
            className={accountTableLinkClassName}
            data-testid="account-section-link-label"
          >
            {sectionLabel}
          </Link>
          <AccountSectionStatusBadge status={sectionStatus} />
        </div>
      </td>
    </tr>
  );
}
