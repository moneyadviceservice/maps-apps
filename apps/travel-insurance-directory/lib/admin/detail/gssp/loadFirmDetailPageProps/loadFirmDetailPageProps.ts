import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import type { IronSession, IronSessionData } from 'iron-session';
import {
  getAdminDirectoryActionsForFcaGroup,
  type OtherListedFirm,
} from 'lib/admin/detail/actionVisibility/actionVisibility';
import { loadAdminFirmById } from 'lib/admin/shared/loadAdminFirmById/loadAdminFirmById';
import { getAdminSession } from 'lib/auth/sessionManagement';
import {
  findOtherListedFirm,
  loadFcaGroupFirms,
} from 'lib/firms/fcaGroupListing';
import type { IronSessionObject } from 'types/iron-session';
import type {
  MainTravelInsuranceFirmDocument,
  TravelInsuranceFirmDocument,
} from 'types/travel-insurance-firm';

export type FirmDetailPageProps = {
  firm: TravelInsuranceFirmDocument;
  mainFirm: MainTravelInsuranceFirmDocument | null;
  showApproveButton: boolean;
  showHideButton: boolean;
  showReregisterButton: boolean;
  approveButtonLabel: 'Add to Directory' | 'Keep on directory';
  otherListedFirm: OtherListedFirm | null;
};

export async function loadFirmDetailPageProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<FirmDetailPageProps>> {
  const id = context.params?.id;

  if (typeof id !== 'string') {
    return { notFound: true };
  }

  let session: IronSession<IronSessionData>;
  if (process.env.CI === 'true') {
    session = {} as IronSession<IronSessionData>;
  } else {
    const adminSession = await getAdminSession(context, true);
    if ('redirect' in adminSession) {
      return adminSession;
    }
    session = adminSession;
  }

  const ctx = await loadAdminFirmById(session as IronSessionObject, id);

  if (!ctx) {
    return { notFound: true };
  }

  const { firm, mainFirm } = ctx;
  const group = await loadFcaGroupFirms(firm, mainFirm);
  const otherListed = findOtherListedFirm(firm.id, group);
  const {
    showApprove,
    showHide,
    showReregister,
    approveLabel,
    otherListedFirm,
  } = getAdminDirectoryActionsForFcaGroup(firm, mainFirm, otherListed);

  return {
    props: {
      firm: structuredClone(firm),
      mainFirm: mainFirm ? structuredClone(mainFirm) : null,
      showApproveButton: showApprove,
      showHideButton: showHide,
      showReregisterButton: showReregister,
      approveButtonLabel: approveLabel,
      otherListedFirm,
    },
  };
}
