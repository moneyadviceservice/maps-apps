import { SocialShareTool } from '@maps-react/common/components/SocialShareTool';
import useTranslation from '@maps-react/hooks/useTranslation';

import { BASE_URL } from '../../../lib/constants/constants';

export const SummaryResultsShare = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6 py-6 border-t xl:justify-between xl:flex-row border-slate-400 print:hidden">
      <SocialShareTool
        url={`${BASE_URL}`}
        title={t('summaryPage.share.title')}
        subject={t('summaryPage.share.subject')}
        emailBodyText={t('summaryPage.share.emailBodyText')}
        xTitle={t('summaryPage.share.xTitle')}
        withDivider
      />
    </div>
  );
};
