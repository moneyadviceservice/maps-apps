import { useTranslation } from '@maps-digital/shared/hooks';

import { Link } from '@maps-react/common/components/Link/Link';
import { StepComponent } from '@maps-react/mhf/types';
import { Markdown } from '@maps-react/vendor/components/Markdown/Markdown';

import { FORM_BASE_PATH } from '../../constants';

export const Decline: StepComponent = ({ step }) => {
  const { t } = useTranslation();
  const contentKey = `${FORM_BASE_PATH}/components.${step}`;
  return (
    <>
      <section data-testid={`${step}-section`}>
        <Markdown content={t(`${contentKey}.content`)} />
      </section>

      <Link
        className="inline-block mt-12 max-md:w-full max-md:text-center max-md:mb-8"
        asButtonVariant="primary"
        href={t(`${contentKey}.cta-link`)}
      >
        {t(`${FORM_BASE_PATH}/common.exit-cta`)}
      </Link>
    </>
  );
};
