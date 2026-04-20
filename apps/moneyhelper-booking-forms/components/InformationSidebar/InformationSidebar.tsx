import { H5, InformationCallout, Paragraph } from '@maps-digital/shared/ui';

import useTranslation from '@maps-react/hooks/useTranslation';

export const InformationSidebar = ({ flow }: { flow: string | undefined }) => {
  const { t } = useTranslation();

  return (
    (flow && (
      <InformationCallout
        className="p-6 md:w-[350px] bg-slate-300 border-none"
        data-testid="information-sidebar"
      >
        <H5 className="mb-4" data-testid="information-sidebar-title">
          {t(`components.sidebar.information.${flow}.title`)}
        </H5>

        <Paragraph data-testid="information-sidebar-content">
          {t(`components.sidebar.information.${flow}.content`)}
        </Paragraph>
        <div className="px-2">
          <Paragraph
            className="font-bold"
            data-testid="information-sidebar-duration-label"
          >
            {t(`components.sidebar.information.duration.label`)}
          </Paragraph>
          <Paragraph data-testid="information-sidebar-duration-value">
            {t(`components.sidebar.information.duration.value.oneHour`)}
          </Paragraph>
        </div>
        <hr className="mb-4 border-slate-500" />
        <div className="px-2">
          <Paragraph
            className="font-bold"
            data-testid="information-sidebar-appointment-format-label"
          >
            {t(`components.sidebar.information.appointment-format.label`)}
          </Paragraph>
          <Paragraph data-testid="information-sidebar-appointment-format-value">
            {t(`components.sidebar.information.appointment-format.value`)}
          </Paragraph>
        </div>
      </InformationCallout>
    )) ||
    null
  );
};
