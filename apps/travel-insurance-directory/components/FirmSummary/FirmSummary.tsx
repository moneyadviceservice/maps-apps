import { firmSummary } from 'data/components/firmSummary/firmSummary';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';
import {
  formatOpeningTimesInline,
  formatYesWithAmount,
  getMedicalConditionsText,
  type Z,
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

export type YesNoWithMoreInfoProps = {
  value: boolean | null | undefined;
  z: Z;
  moreInfo: string;
};

export const YesNoWithMoreInfo = ({
  value,
  z,
  moreInfo,
}: YesNoWithMoreInfoProps) => {
  if (value) {
    return (
      <>
        <div className="text-[19px] font-bold text-gray-800 flex items-center mb-2">
          <Icon
            type={IconType.TICK_GREEN}
            className="mr-2"
            width={20}
            height={20}
          />
          {firmSummary.common.yes(z)}
        </div>
        <ExpandableSection
          title={
            <span className="text-lg">{firmSummary.common.moreInfo(z)}</span>
          }
          variant="hyperlink"
        >
          <Paragraph className="text-sm">{moreInfo}</Paragraph>
        </ExpandableSection>
      </>
    );
  }
  return (
    <div className="text-[19px] font-bold text-gray-800">
      {firmSummary.common.no(z)}
    </div>
  );
};

export const FirmSummary = ({ firm }: Props) => {
  const { z } = useTranslation();
  const serviceDetails = firm.service_details;
  const medicalCoverage = firm.medical_coverage;
  const websiteAddress =
    firm.website_address || firm.offices?.[0]?.contact?.website;

  return (
    <InformationCallout className="p-6 pb-8 border-gray-95 border-3 rounded-bl-3xl max-w-[948px]">
      <Heading level="h3" component="h3" className="mb-4 text-blue-700">
        {firm.registered_name}
      </Heading>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 pb-4 border-b-1 border-gray-300 gap-4 md:gap-0">
        <div className="w-full relative">
          <ExpandableSection
            title={
              <span className="font-bold text-lg">
                {firmSummary.contactDetails.title(z)}
              </span>
            }
            className="[&>summary]:w-fit"
            variant="hyperlink"
          >
            <div className="space-y-4">
              {firm.offices && firm.offices.length > 0 ? (
                firm.offices.map((office, index) => {
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
                      key={firm.registered_name}
                      className="space-y-2 not-italic text-sm text"
                      data-testid={`office-contact-${index}`}
                    >
                      {office.contact?.telephone_number && (
                        <div
                          data-testid={`office-telephone-${index}`}
                          className="text-lg"
                        >
                          <Paragraph className="inline ">
                            {firmSummary.contactDetails.call(z)}{' '}
                          </Paragraph>
                          <a
                            href={`tel:${office.contact.telephone_number}`}
                            className="text-magenta-700 underline visited:text-magenta-700"
                          >
                            {office.contact.telephone_number}
                          </a>
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
                          className="text-lg"
                        >
                          <Paragraph className="inline ">
                            {firmSummary.contactDetails.email(z)}{' '}
                          </Paragraph>
                          <a
                            href={`mailto:${office.contact.email_address}`}
                            className="text-magenta-700 underline visited:text-magenta-700"
                          >
                            {office.contact.email_address}
                          </a>
                        </div>
                      )}
                      {index < firm.offices.length - 1 && (
                        <div className="border-t border-gray-300 pt-4 mt-4" />
                      )}
                    </div>
                  );
                })
              ) : (
                <Paragraph className="text-sm">
                  {firmSummary.contactDetails.noContactDetails(z)}
                </Paragraph>
              )}
            </div>
          </ExpandableSection>
          {websiteAddress && (
            <div className="w-full md:w-1/2 md:text-right mb-auto md:mt-2 md:absolute top-0 right-0">
              <Link href={websiteAddress} target="_blank" withIcon={false}>
                {firmSummary.contactDetails.visitWebsite(z)}
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-gray-300">
          <div>
            <div className="text-lg mb-2">
              {firmSummary.medicalConditions.label(z)}
            </div>
            <div className="text-[19px] font-bold text-gray-800">
              {getMedicalConditionsText(
                medicalCoverage.covers_medical_condition_question,
                z,
              ) || firmSummary.medicalConditions.notSpecified(z)}
            </div>
          </div>

          <div>
            <div className="text-lg mb-2">
              {firmSummary.medicalEquipment.label(z)}
            </div>
            {serviceDetails?.will_cover_specialist_equipment ? (
              <div className="text-[19px] font-bold text-gray-800 flex items-center">
                <Icon
                  type={IconType.TICK_GREEN}
                  className="mr-2"
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
              <div className="text-[19px] font-bold text-gray-800">
                {firmSummary.medicalEquipment.no(z)}
              </div>
            )}
          </div>

          <div>
            <div className="text-lg mb-2">
              {firmSummary.cruiseCover.label(z)}
            </div>
            <div
              className="text-[19px] font-bold text-gray-800 flex items-center"
              data-testid="cruise-cover-yes"
            >
              <Icon
                type={IconType.TICK_GREEN}
                className="mr-2"
                width={20}
                height={20}
              />
              {firmSummary.cruiseCover.yes(z)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div>
            <div className="text-lg mb-2">
              {firmSummary.medicalScreening.label(z)}
            </div>
            <div className="text-[19px] font-bold text-gray-800 mb-2">
              {serviceDetails?.medical_screening_company ||
                firmSummary.medicalConditions.notSpecified(z)}
            </div>
            <ExpandableSection
              title={
                <span className="text-lg">
                  {firmSummary.medicalScreening.moreInfo(z)}
                </span>
              }
              variant="hyperlink"
            >
              <Paragraph className="text-sm">
                {firmSummary.medicalScreening.description(z)}
              </Paragraph>
            </ExpandableSection>
          </div>

          <div>
            <div className="text-lg mb-2">
              {firmSummary.covidMedical.label(z)}
            </div>
            <YesNoWithMoreInfo
              value={serviceDetails?.covid19_medical_repatriation}
              z={z}
              moreInfo={firmSummary.covidMedical.moreInfo(z)}
            />
          </div>

          <div>
            <div className="text-lg mb-2">
              {firmSummary.covidCancellation.label(z)}
            </div>
            <YesNoWithMoreInfo
              value={serviceDetails?.covid19_cancellation_cover}
              z={z}
              moreInfo={firmSummary.covidCancellation.moreInfo(z)}
            />
          </div>
        </div>
      </div>
    </InformationCallout>
  );
};
