import { useTranslation } from '@maps-react/hooks/useTranslation';

export const confirmStepData = (z: ReturnType<typeof useTranslation>['z']) => ({
  pageName: `confirm-answers`,
  pageTitle: z({ en: 'Confirm Details', cy: 'Cadarnhau manylion' }),
  stepName: 'Confirm Details',
});
