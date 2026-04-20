import { useCallback } from 'react';

import { firmSummary } from 'data/components/firmSummary/firmSummary';
import { useFirmListingsPageAnalytics } from 'hooks/useFirmListingsPageAnalytics';
import { buildProviderWebsiteOutboundClickEventInfo } from 'lib/analytics/trackProviderWebsiteOutboundClick';
import {
  MedicalCoverage,
  Office,
  TravelInsuranceFirmDocument,
} from 'types/travel-insurance-firm';
import {
  formatOpeningTimesInline,
  formatYesWithAmount,
  getMedicalConditionsText,
} from 'utils/firmSummary';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

type Props = {
  firm: TravelInsuranceFirmDocument;
};

export const FirmSummary = ({ firm }: Props) => {
  const { z } = useTranslation();
  const { trackFirmListingsEvent } = useFirmListingsPageAnalytics();
  const visitWebsiteLinkText = firmSummary.contactDetails.visitWebsite(z);
  const serviceDetails = firm.service_details;
  const medicalCoverage = firm.medical_coverage as MedicalCoverage;
  const offices = firm.offices as Office[];
  const websiteAddress =
    firm.website_address || firm.offices?.[0]?.contact?.website;

  const onVisitWebsiteClick = useCallback(() => {
    const url = websiteAddress;
    if (!url) return;
    trackFirmListingsEvent({
      event: 'outboundClick',
      eventInfo: buildProviderWebsiteOutboundClickEventInfo({
        linkUrl: url,
        linkText: visitWebsiteLinkText,
        providerName: firm.registered_name ?? '',
      }),
    });
  }, [
    firm.registered_name,
    trackFirmListingsEvent,
    visitWebsiteLinkText,
    websiteAddress,
  ]);
  const medicalConditionsValue =
    getMedicalConditionsText(
      medicalCoverage.covers_medical_condition_question,
      z,
    ) || firmSummary.medicalConditions.notSpecified(z);

  const screeningCompany =
    serviceDetails?.medical_screening_company ||
    firmSummary.medicalConditions.notSpecified(z);
  const hasScreeningCompany = Boolean(
    serviceDetails?.medical_screening_company?.trim(),
  );

  return (
    <InformationCallout className="p-6 pb-8 border-gray-95 border-3 rounded-bl-3xl max-w-[948px]">
      <Heading
        level="h3"
        component="h3"
        className="mb-2 max-w-full min-w-0 text-blue-700 [overflow-wrap:anywhere]"
      >
        {firm.registered_name}
      </Heading>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center pb-1 border-gray-300 gap-4 md:gap-0">
        <div className="w-full relative">
          <ExpandableSection
            title={
              <span className="font-bold text-base">
                {firmSummary.contactDetails.title(z)}
              </span>
            }
            className="[&>summary]:w-fit"
            variant="hyperlink"
          >
            <div className="space-y-4">
              {offices && offices.length > 0 ? (
                offices.map((office, index) => {
                  const openingTimesStr = office.opening_times?.[0]
                    ? formatOpeningTimesInline(
                        office.opening_times[0].weekday,
                        office.opening_times[0].saturday,
                        office.opening_times[0].sunday,
                        z,
                      )
                    : '';
                  return (
                    <div
                      key={`office-${index}`}
                      className="space-y-2 not-italic text-base text"
                      data-testid={`office-contact-${index}`}
                    >
                      {office.contact?.telephone_number && (
                        <div
                          data-testid={`office-telephone-${index}`}
                          className="text-base"
                        >
                          <Paragraph className="inline ">
                            {firmSummary.contactDetails.call(z)}{' '}
                          </Paragraph>
                          <Link
                            href={`tel:${office.contact.telephone_number}`}
                            className="text-magenta-700 underline visited:text-magenta-700"
                          >
                            {office.contact.telephone_number}
                          </Link>
                          {openingTimesStr && (
                            <>
                              {' – '}
                              <span
                                className="text-gray-800"
                                data-testid={`office-opening-times-${index}`}
                              >
                                {openingTimesStr}
                              </span>
                            </>
                          )}
                        </div>
                      )}
                      {office.contact?.email_address && (
                        <div
                          data-testid={`office-email-${index}`}
                          className="text-base"
                        >
                          <Paragraph className="inline ">
                            {firmSummary.contactDetails.email(z)}{' '}
                          </Paragraph>
                          <Link
                            href={`mailto:${office.contact.email_address}`}
                            className="text-magenta-700 underline visited:text-magenta-700"
                          >
                            {office.contact.email_address}
                          </Link>
                        </div>
                      )}
                      {index < offices.length - 1 && (
                        <div className="border-t border-gray-300 pt-4 mt-4" />
                      )}
                    </div>
                  );
                })
              ) : (
                <Paragraph className="text-base">
                  {firmSummary.contactDetails.noContactDetails(z)}
                </Paragraph>
              )}
            </div>
          </ExpandableSection>
          {websiteAddress && (
            <div className="h-12 flex items-center lg:justify-end w-full lg:w-2/3 lg:text-right mb-auto lg:absolute top-0 right-0">
              <Link
                href={websiteAddress}
                target="_blank"
                withIcon={false}
                onClick={onVisitWebsiteClick}
              >
                {visitWebsiteLinkText}
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-300">
              <th
                scope="col"
                className="max-w-[376px] min-w-0 text-base font-bold text-gray-800 py-[8px] pr-[24px] align-top"
              >
                {firmSummary.policyTable.featureColumn(z)}
              </th>
              <th
                scope="col"
                className="min-w-0 text-base font-bold text-gray-800 py-[8px] pr-[24px] align-top"
              >
                {firmSummary.policyTable.detailsColumn(z)}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-300">
              <td className="max-w-[376px] min-w-0 text-base py-[8px] pr-[24px] align-top">
                {firmSummary.medicalConditions.label(z)}
              </td>
              <td className="min-w-0 text-base font-bold text-gray-800 py-[8px] pr-[24px] align-top">
                {medicalConditionsValue}
              </td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="max-w-[376px] min-w-0 text-base py-[8px] pr-[24px] align-top">
                {firmSummary.medicalEquipment.label(z)}
              </td>
              <td className="min-w-0 py-[8px] pr-[24px] align-top">
                {serviceDetails?.will_cover_specialist_equipment ? (
                  <div className="text-base font-bold text-gray-800 flex items-center">
                    <Icon
                      type={IconType.TICK_GREEN}
                      className="mr-2 shrink-0"
                      width={20}
                      height={20}
                    />
                    {formatYesWithAmount(
                      serviceDetails.will_cover_specialist_equipment,
                      serviceDetails.cover_for_specialist_equipment,
                      z,
                    )}
                  </div>
                ) : (
                  <div className="text-base font-bold text-gray-800">
                    {firmSummary.medicalEquipment.no(z)}
                  </div>
                )}
              </td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="max-w-[376px] min-w-0 text-base py-[8px] pr-[24px] align-top">
                {firmSummary.medicalScreening.label(z)}
              </td>
              <td className="min-w-0 py-[8px] pr-[24px] align-top">
                <div
                  className="text-base font-bold text-gray-800 flex items-center capitalize"
                  data-testid="medical-screening-value"
                >
                  {hasScreeningCompany && (
                    <Icon
                      type={IconType.TICK_GREEN}
                      className="mr-2 shrink-0"
                      width={20}
                      height={20}
                    />
                  )}
                  {screeningCompany}
                </div>
              </td>
            </tr>
            <tr>
              <td className="max-w-[376px] min-w-0 text-base py-[8px] pr-[24px] align-top">
                {firmSummary.cruiseCover.label(z)}
              </td>
              <td className="min-w-0 py-[8px] pr-[24px] align-top">
                <div
                  className="text-base font-bold text-gray-800 flex items-center"
                  data-testid="cruise-cover-yes"
                >
                  <Icon
                    type={IconType.TICK_GREEN}
                    className="mr-2 shrink-0"
                    width={20}
                    height={20}
                  />
                  {firmSummary.cruiseCover.yes(z)}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </InformationCallout>
  );
};
