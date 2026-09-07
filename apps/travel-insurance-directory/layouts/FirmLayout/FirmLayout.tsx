import { ReactNode } from 'react';

import {
  AccountDirectoryStatusRow,
  AccountFrnRow,
  AccountRegisteredNameRow,
  AccountSectionLinkRow,
} from 'components/Account/AccountFirmTableRows';
import type { AccountSectionStatus } from 'components/Account/AccountSectionStatusBadge';
import { accountFirmRowLabels } from 'data/pages/account/tradingNames';

import { Callout, CalloutVariant } from '@maps-react/common/components/Callout';
import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';

const tableScrollWrapperClassName = 'overflow-x-auto max-w-3xl min-w-0';

const tableMinWidthClassName = 'lg:min-w-[36rem]';

export type FirmLayoutStatusRow = {
  changeHref: string;
  sectionStatus: AccountSectionStatus;
};

export type FirmLayoutFirmBlock = {
  registeredName: string;
  registeredNameHref?: string;
  frn: string;
  directoryStatusLabel: string;
  coverAndService: FirmLayoutStatusRow;
  customerContactDetails: FirmLayoutStatusRow;
};

export type FirmLayoutFirmBlockRowLabels = {
  registeredName: string;
  frn: string;
  status: string;
  coverAndService: string;
  customerContactDetails: string;
};

export type FirmLayoutIntroParagraph = {
  id: string;
  content: ReactNode;
};

const defaultFirmBlockRowLabels: FirmLayoutFirmBlockRowLabels = {
  ...accountFirmRowLabels,
};

export type FirmLayoutProps = {
  pageHeading: string;
  /** Optional warning-style callout directly under the page H1 (register `Callout` pattern). */
  callout?: ReactNode;
  introParagraphs: readonly FirmLayoutIntroParagraph[];
  mainAuthorisedFirmHeading: string;
  mainAuthorisedFirm: FirmLayoutFirmBlock;
  firmBlockRowLabels?: Partial<FirmLayoutFirmBlockRowLabels>;
};

function mergeFirmBlockRowLabels(
  partial?: Partial<FirmLayoutFirmBlockRowLabels>,
): FirmLayoutFirmBlockRowLabels {
  return { ...defaultFirmBlockRowLabels, ...partial };
}

function FirmBlockTable({
  block,
  rowLabels,
}: Readonly<{
  block: FirmLayoutFirmBlock;
  rowLabels: FirmLayoutFirmBlockRowLabels;
}>) {
  return (
    <div className={tableScrollWrapperClassName}>
      <table className={`w-full text-base ${tableMinWidthClassName}`}>
        <tbody>
          <AccountRegisteredNameRow
            registeredNameLabel={rowLabels.registeredName}
            registeredName={block.registeredName}
            registeredNameHref={block.registeredNameHref}
          />
          <AccountFrnRow frnLabel={rowLabels.frn} frn={block.frn} />
          <AccountDirectoryStatusRow
            statusLabel={rowLabels.status}
            directoryStatusLabel={block.directoryStatusLabel}
          />
          <AccountSectionLinkRow
            sectionLabel={rowLabels.coverAndService}
            href={block.coverAndService.changeHref}
            sectionStatus={block.coverAndService.sectionStatus}
          />
          <AccountSectionLinkRow
            sectionLabel={rowLabels.customerContactDetails}
            href={block.customerContactDetails.changeHref}
            sectionStatus={block.customerContactDetails.sectionStatus}
          />
        </tbody>
      </table>
    </div>
  );
}

export const FirmLayout = ({
  pageHeading,
  callout,
  introParagraphs,
  mainAuthorisedFirmHeading,
  mainAuthorisedFirm,
  firmBlockRowLabels,
}: FirmLayoutProps) => {
  const blockLabels = mergeFirmBlockRowLabels(firmBlockRowLabels);

  return (
    <div className="space-y-6">
      <Heading level="h1" className="text-gray-800">
        {pageHeading}
      </Heading>

      {callout ? (
        <Callout
          variant={CalloutVariant.WARNING}
          testId="firm-layout-callout"
          className="max-w-3xl"
        >
          {callout}
        </Callout>
      ) : null}

      <div className="space-y-4 max-w-3xl">
        {introParagraphs.map((paragraph) => (
          <Paragraph key={paragraph.id}>{paragraph.content}</Paragraph>
        ))}
      </div>

      <section className="space-y-4" data-testid="main-authorised-firm-section">
        <Heading level="h2" className="text-xl font-bold text-gray-800">
          {mainAuthorisedFirmHeading}
        </Heading>
        <FirmBlockTable block={mainAuthorisedFirm} rowLabels={blockLabels} />
      </section>
    </div>
  );
};
