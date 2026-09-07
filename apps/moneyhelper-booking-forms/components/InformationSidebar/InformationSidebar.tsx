import { H5, InformationCallout, Paragraph } from '@maps-digital/shared/ui';

import useTranslation from '@maps-react/hooks/useTranslation';
import { asString } from '@maps-react/mhf/utils';

import { SidebarType } from '../../lib/constants';
import { BookingEntry } from '../../lib/types';

type InformationSidebar = {
  flow?: string;
  entry?: BookingEntry;
};

export const InformationSidebar = ({ flow, entry }: InformationSidebar) => {
  if (!entry) {
    throw new TypeError('[InformationSidebar] Missing entry');
  }

  const { t } = useTranslation();
  const componentKey = `components.sidebar.${SidebarType.INFORMATION}`;
  const detailsComponentKey = `${componentKey}.details`;

  const {
    accessSupportStatus,
    accessOptionsRequest,
    accessOptionsDetails,
    accessLanguageType,
    accessLanguageOther,
  } = entry.data;

  // Determine the access language to display based on the accessLanguageType and accessLanguageOther values
  const accessLanguage =
    accessLanguageType === 'other' ? accessLanguageOther : accessLanguageType;

  // Determine the duration and format value keys based on the accessOptionsRequest value
  const durationValue = accessOptionsRequest
    ? `${detailsComponentKey}.${accessOptionsRequest}.duration-value`
    : `${detailsComponentKey}.duration-value`;
  const formatValue = accessOptionsRequest
    ? `${detailsComponentKey}.${accessOptionsRequest}.format-value`
    : `${detailsComponentKey}.format-value`;

  // Determine the request value key based on the accessOptionsDetails and accessOptionsRequest values
  const requestValue = accessOptionsDetails
    ? `${detailsComponentKey}.request-value`
    : accessOptionsRequest
    ? `${detailsComponentKey}.${accessOptionsRequest}.request-value`
    : undefined;

  return (
    (flow && (
      <InformationCallout
        className="p-6 md:w-[350px] bg-slate-300 border-none"
        data-testid="information-sidebar"
      >
        <H5 className="mb-4" data-testid="information-sidebar-title">
          {t(`${componentKey}.overview.${flow}.title`)}
        </H5>

        <Paragraph data-testid="information-sidebar-content">
          {t(`${componentKey}.overview.${flow}.content`)}
        </Paragraph>
        <div className="px-2">
          <Paragraph
            className="font-bold"
            data-testid="information-sidebar-duration-label"
          >
            {t(`${detailsComponentKey}.duration-label`)}
          </Paragraph>
          <Paragraph data-testid="information-sidebar-duration-value">
            {t(durationValue)}
          </Paragraph>
        </div>
        <hr className="mb-4 border-slate-500" />
        <div className="px-2">
          <Paragraph
            className="font-bold"
            data-testid="information-sidebar-appointment-format-label"
          >
            {t(`${detailsComponentKey}.format-label`)}
          </Paragraph>
          <Paragraph data-testid="information-sidebar-appointment-format-value">
            {t(formatValue)}
          </Paragraph>
        </div>
        {requestValue && accessSupportStatus !== 'none-requested' && (
          <>
            <hr className="mb-4 border-slate-500" />
            <div className="px-2">
              <Paragraph
                className="font-bold"
                data-testid="information-sidebar-appointment-request-label"
              >
                {t(`${detailsComponentKey}.request-label`)}
              </Paragraph>
              <Paragraph
                className="mb-0"
                data-testid="information-sidebar-appointment-request-value"
              >
                {t(requestValue, { accessLanguage: asString(accessLanguage) })}
              </Paragraph>
            </div>
          </>
        )}
      </InformationCallout>
    )) ||
    null
  );
};
