import { Icon, IconType } from '@maps-react/common/components/Icon';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown/Markdown';

import { FORM_BASE_PATH, StepName } from '../../constants';

type LoadingProps = {
  submitPath: string;
};

export const Loading = ({ submitPath }: LoadingProps) => {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <Icon
        type={IconType.SPINNER_MHPD}
        className="w-[80px] h-[80px] animate-spin mx-auto mb-6 text-blue-700 md:mb-12"
        data-testid="nonjs-spinner"
      />
      <Markdown
        className="text-2xl font-bold"
        testId="loading-content"
        content={t(`${FORM_BASE_PATH}/components.${StepName.LOADING}.title`)}
      />
      <meta httpEquiv="refresh" content={`2;url=${submitPath}`} />
    </div>
  );
};
