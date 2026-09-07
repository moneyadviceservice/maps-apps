import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export const PensionDownload = () => {
  const { t, locale } = useTranslation();

  return (
    <div className="flex justify-end w-full mt-2">
      <Link
        href={`/${locale}/feature-not-available`}
        data-testid="download-pension-information-link"
        color="text-blue-500"
        className="gap-1 text-[18px] leading-5 text-right md:gap-2 md:leading-6"
      >
        <span className="block min-w-0">
          <Icon
            type={IconType.DOWNLOAD}
            className="inline-block align-middle -mt-[1px] mr-1 md:mr-2"
          />
          {t('site.download-pension-information-link-text')}
        </span>
      </Link>
    </div>
  );
};
