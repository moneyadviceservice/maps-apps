import { H3, Icon, IconType } from '@maps-digital/shared/ui';

import useTranslation from '@maps-react/hooks/useTranslation';
import { StepComponent } from '@maps-react/mhf/types';

export const Loading: StepComponent = () => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto text-center max-w-[636px] mb-40">
      <Icon
        type={IconType.SPINNER_MONEYHELPER}
        className="w-[90px] h-[90px] animate-spin mx-auto my-10 text-magenta-500"
        data-testid="nonjs-spinner"
      />
      <H3 className="mt-16">{t('common.loading.content')}</H3>
    </div>
  );
};
