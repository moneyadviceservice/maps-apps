import { SyntheticEvent } from 'react';

import { TranslationGroup } from 'data/types';

import { Button } from '@maps-react/common/components/Button';
import { H2 } from '@maps-react/common/components/Heading';
import useTranslation from '@maps-react/hooks/useTranslation';

export type ResetCalculatorProps = {
  title: TranslationGroup;
  description: TranslationGroup;
  confirmLabel: TranslationGroup;
  cancelLabel: TranslationGroup;
  confirmAction: string;
  cancelAction: string;
  onCancelClick?: (event: SyntheticEvent) => void;
};

const ResetCalculator = ({
  title,
  description,
  confirmLabel,
  cancelLabel,
  confirmAction,
  cancelAction,
  onCancelClick,
}: ResetCalculatorProps) => {
  const { z } = useTranslation();

  return (
    <div id="ajax">
      <H2 color="text-blue-800">{z(title)}</H2>
      <p className="pb-4">{z(description)}</p>
      <div className="flex flex-row items-start gap-5">
        <Button formAction={confirmAction}>{z(confirmLabel)}</Button>
        <Button
          variant="secondary"
          formAction={cancelAction}
          onClick={onCancelClick}
        >
          {z(cancelLabel)}
        </Button>
      </div>
    </div>
  );
};

export default ResetCalculator;
