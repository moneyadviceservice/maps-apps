import { Button } from '@maps-react/common/components/Button';
import { Icon, IconType } from '@maps-react/common/components/Icon';

export type SummaryDownloadProps = {
  testId?: string;
  query: Record<string, string>;
};

export const SummaryDownload = ({
  testId = 'summary-download-form',
  query,
}: SummaryDownloadProps) => {
  const lang = query.language;
  const defaultAction = process.env.NEXT_PUBLIC_DOWNLOAD_SUMMARY_URL;
  const cyAction = process.env.NEXT_PUBLIC_DOWNLOAD_SUMMARY_URL_CY;
  const actionUrl = lang === 'cy' ? cyAction : defaultAction;

  return (
    <form action={actionUrl} method="POST" target="_blank" data-testid={testId}>
      <input
        type="hidden"
        value={query.urn}
        name="appointment_summary[urn]"
        id="download_appointment_summary_urn"
      />
      <input
        type="hidden"
        value={query.t2q3 === '1' || query.t2q3 === '3' ? 'true' : 'false'}
        name="appointment_summary[supplementary_benefits]"
        id="download_appointment_summary_supplementary_benefits"
      />
      <input
        type="hidden"
        value={query.t3q1 === '1' || query.t3q1 === '3' ? 'true' : 'false'}
        name="appointment_summary[supplementary_debt]"
        id="download_appointment_summary_supplementary_debt"
      />
      <input
        type="hidden"
        value="true"
        name="appointment_summary[supplementary_ill_health]"
        id="download_appointment_summary_supplementary_ill_health"
      />
      <input
        type="hidden"
        value="true"
        name="appointment_summary[supplementary_defined_benefit_pensions]"
        id="download_appointment_summary_supplementary_defined_benefit_pensions"
      />
      <input
        type="hidden"
        value={query.t1q2 === '1' || query.t1q2 === '3' ? 'true' : 'false'}
        name="appointment_summary[supplementary_pension_transfers]"
        id="download_appointment_summary_supplementary_pension_transfers"
      />
      {lang !== 'cy' && (
        <input
          type="hidden"
          value={query.age === '2' ? '50_54' : 'standard'}
          name="appointment_summary[appointment_type]"
          id="download_appointment_summary_appointment_type"
        />
      )}

      <Button
        variant="secondary"
        type="submit"
        iconRight={<Icon type={IconType.DOWNLOAD} />}
      >
        {lang === 'cy'
          ? 'Lawrlwytho crynodeb (PDF)'
          : 'Download your summary (PDF)'}
      </Button>
    </form>
  );
};
