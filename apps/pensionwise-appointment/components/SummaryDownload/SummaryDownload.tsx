import { Link } from '@maps-digital/shared/ui';

import { Icon, IconType } from '@maps-react/common/components/Icon';
import useTranslation from '@maps-react/hooks/useTranslation';

export type SummaryDownloadProps = {
  testId?: string;
  query: Record<string, string>;
};

export const SummaryDownload = ({
  testId = 'summary-download',
  query,
}: SummaryDownloadProps) => {
  const { z } = useTranslation();
  const lang = query.language;
  const defaultAction = process.env.NEXT_PUBLIC_DOWNLOAD_SUMMARY_URL;

  let actionUrl = '';

  if (lang === 'cy') {
    if (query.age === '2')
      actionUrl = `${defaultAction}/non-standard-db-cy.pdf`;
    else actionUrl = `${defaultAction}/standard-db-cy.pdf`;
  } else if (query.age === '2')
    actionUrl = `${defaultAction}/non-standard-db.pdf`;
  else actionUrl = `${defaultAction}/standard-db.pdf`;

  return (
    <Link
      data-testid={testId}
      href={actionUrl}
      asButtonVariant="secondary"
      download
      target="_blank"
      withIcon={false}
      className="flex w-fit"
    >
      <span>
        {z({
          en: 'Download your summary (PDF)',
          cy: 'Lawrlwytho crynodeb (PDF)',
        })}
      </span>
      <Icon type={IconType.DOWNLOAD} />
    </Link>
  );
};
