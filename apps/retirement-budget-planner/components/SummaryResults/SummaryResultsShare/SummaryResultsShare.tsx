import { SocialShareTool } from '@maps-react/common/components/SocialShareTool';
import useTranslation from '@maps-react/hooks/useTranslation';

export const SummaryResultsShare = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6 pt-4 xl:pt-6 xl:justify-between xl:flex-row border-t-1 border-slate-400">
      <SocialShareTool
        url="#"
        title={t('summaryPage.share.title')}
        subject={t('summaryPage.share.subject')}
        xTitle={t('summaryPage.share.xTitle')}
        withDivider
      />
    </div>
  );
};
