import { SyntheticEvent } from 'react';

import { Button } from '@maps-react/common/components/Button';
import { H2 } from '@maps-react/common/components/Heading';
import useTranslation from '@maps-react/hooks/useTranslation';

export type ResetCalculatorProps = {
  confirmAction: string;
  cancelAction: string;
  onCancelClick?: (event: SyntheticEvent) => void;
};

const ResetCalculator = ({
  confirmAction,
  cancelAction,
  onCancelClick,
}: ResetCalculatorProps) => {
  const { t } = useTranslation();

  return (
    <div id="ajax">
      <H2 color="text-blue-700">{t('components.reset-calculator.title')}</H2>
      <p className="pb-4">{t('components.reset-calculator.description')}</p>
      <div className="flex flex-row items-start gap-5">
        <Button formAction={confirmAction}>
          {t('components.reset-calculator.confirm')}
        </Button>
        <Button
          variant="secondary"
          formAction={cancelAction}
          onClick={onCancelClick}
        >
          {t('components.reset-calculator.cancel')}
        </Button>
      </div>
    </div>
  );
};

export default ResetCalculator;
