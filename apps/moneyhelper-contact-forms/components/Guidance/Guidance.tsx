import { useRouter } from 'next/router';

import { Button } from '@maps-react/common/components/Button';
import { useLanguage } from '@maps-react/hooks/useLanguage';
import useTranslation from '@maps-react/hooks/useTranslation';
import { SectionsRenderer, SubTitleRenderer } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';

import { StepName } from '../../lib/constants';

export const Guidance: StepComponent = () => {
  const { t, tList } = useTranslation();
  const lang = useLanguage();
  const sections = tList('components.guidance.sections');
  const router = useRouter();
  // Use router.asPath to get the current query string (safe for SSR)
  const queryString = router.asPath.includes('?')
    ? router.asPath.substring(router.asPath.indexOf('?'))
    : '';

  return (
    <>
      <div className="flex flex-col gap-4 pt-4">
        <SubTitleRenderer
          content={t('components.guidance.sub-title')}
          testId="guidance-sub-title"
        />
        <SectionsRenderer sections={sections} testIdPrefix="guidance" />
      </div>
      <Button
        type="button"
        as="a"
        href={`/${lang}/${StepName.ENQUIRY_TYPE}${queryString}`}
        variant="primary"
        data-testid="guidance-continue-button"
        className="w-full mt-10 mb-4 md:w-auto"
      >
        {t('common.form.button.continue-text')}
      </Button>
    </>
  );
};
