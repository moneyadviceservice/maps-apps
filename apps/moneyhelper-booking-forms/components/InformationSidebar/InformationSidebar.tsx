import { H5, InformationCallout, Paragraph } from '@maps-digital/shared/ui';

import useTranslation from '@maps-react/hooks/useTranslation';
import { asString } from '@maps-react/mhf/utils';

import { FORM_FIELD_CONTENT_KEY, SidebarType } from '../../lib/constants';
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
  const contentKey = `components.sidebar.${SidebarType.INFORMATION}`;
  const detailsComponentKey = `${contentKey}.details`;

  const {
    accessSupportStatus,
    accessSupportRequest,
    accessSupportDetails,
    accessSupportLanguageType,
    accessSupportLanguageOther,
    accessSupportCompanion,
  } = entry.data;

  // Determine the access language to display based on the accessSupportLanguageType and accessSupportLanguageOther values
  const accessLanguage =
    accessSupportLanguageType === 'other'
      ? accessSupportLanguageOther
      : accessSupportLanguageType;

  // Determine the request value key based on the accessSupportDetails and accessSupportRequest values
  const requestValue = accessSupportDetails
    ? `${detailsComponentKey}.${FORM_FIELD_CONTENT_KEY.accessSupportDetails}`
    : accessSupportRequest || accessSupportStatus !== 'none'
    ? `${detailsComponentKey}.${accessSupportRequest}`
    : accessSupportCompanion
    ? `${detailsComponentKey}.${FORM_FIELD_CONTENT_KEY.accessSupportCompanion}`
    : `${detailsComponentKey}`;

  return (
    (flow && (
      <InformationCallout
        className="p-6 md:w-[350px] bg-slate-300 border-none"
        data-testid="information-sidebar"
      >
        <H5 className="mb-4" data-testid="information-sidebar-title">
          {t(`${contentKey}.overview.${flow}.title`)}
        </H5>
        <Paragraph data-testid="information-sidebar-content">
          {t(`${contentKey}.overview.${flow}.content`)}
        </Paragraph>
        <div className="px-2">
          <Paragraph
            className="font-bold"
            data-testid="information-sidebar-duration-label"
          >
            {t(`${detailsComponentKey}.duration-label`)}
          </Paragraph>
          <Paragraph data-testid="information-sidebar-duration-value">
            {t(`${requestValue}.duration-value`)}
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
            {t(`${requestValue}.format-value`)}
          </Paragraph>
        </div>
        {requestValue && accessSupportStatus !== 'none' && (
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
                {t(`${requestValue}.request-value`, {
                  accessLanguage: asString(accessLanguage),
                })}
              </Paragraph>
            </div>
          </>
        )}
      </InformationCallout>
    )) ||
    null
  );
};
