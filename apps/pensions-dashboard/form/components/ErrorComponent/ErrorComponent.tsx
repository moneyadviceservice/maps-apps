import { Link } from '@maps-react/common/components/Link/Link';
import useTranslation from '@maps-react/hooks/useTranslation';
import { StepComponent } from '@maps-react/mhf/types';
import { Markdown } from '@maps-react/vendor/components/Markdown/Markdown';

import { FORM_BASE_PATH } from '../../constants';

export const ErrorComponent: StepComponent = ({ step }) => {
  const { t } = useTranslation();

  return (
    <>
      <Markdown
        className="mb-6"
        content={t(`${FORM_BASE_PATH}/components.${step}.content`)}
      />
      <Link
        className="inline-block mt-12 max-md:w-full max-md:text-center max-md:mb-8"
        asButtonVariant="primary"
        href={t(`${FORM_BASE_PATH}/common.exit-cta-link`)}
      >
        {t(`${FORM_BASE_PATH}/common.exit-cta`)}
      </Link>
    </>
  );
};
