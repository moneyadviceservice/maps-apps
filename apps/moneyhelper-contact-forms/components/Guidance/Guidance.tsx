import { useRouter } from 'next/router';

import { Button } from '@maps-react/common/components/Button';
import useTranslation from '@maps-react/hooks/useTranslation';

import { StepName } from '../../lib/constants';
import { StepComponent } from '../../lib/types';
import { SectionsRenderer } from '../SectionsRenderer';
import { SubTitleRenderer } from '../SubTitleRenderer';

export const Guidance: StepComponent = () => {
  const { t, tList } = useTranslation();
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
        href={`${StepName.ENQUIRY_TYPE}${queryString}`}
        variant="primary"
        data-testid="guidance-continue-button"
        className="w-full mt-10 mb-4 md:w-auto"
      >
        {t('common.form.button.continue-text')}
      </Button>
    </>
  );
};
