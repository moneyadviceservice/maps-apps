import { Icon, IconType } from '@maps-digital/shared/ui';

import useTranslation from '@maps-react/hooks/useTranslation';
import { StepComponent } from '@maps-react/mhf/types';

// Rendered both as a routed step and directly by pages, so step props are optional here.
type LoadingProps = Partial<Parameters<StepComponent>[0]> & {
  contentKey?: string;
};

export const Loading = ({ contentKey }: LoadingProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Icon
        type={IconType.SPINNER_MONEYHELPER}
        className="w-[90px] h-[90px] animate-spin mx-auto my-10 text-magenta-500"
        data-testid="nonjs-spinner"
      />
      <p className="mb-12 text-2xl font-bold text-center">
        {contentKey
          ? t(`common.loading.${contentKey}.title`)
          : t('common.loading.title')}
        ...
      </p>
    </>
  );
};
