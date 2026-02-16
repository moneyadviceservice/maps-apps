import { RadioButton } from '@maps-react/form/components/RadioButton';
import useTranslation from '@maps-react/hooks/useTranslation';

type CalculationTypeSelectorProps = {
  calculationType: 'single' | 'joint';
  setCalculationType: (type: 'single' | 'joint') => void;
  showRadioButtons: boolean;
  errors?: string | null;
  z: ReturnType<typeof useTranslation>['z'];
};

export const CalculationTypeSelector: React.FC<
  CalculationTypeSelectorProps
> = ({ calculationType, setCalculationType, showRadioButtons, z }) => {
  if (!showRadioButtons) return null;

  return (
    <div className="hidden col-span-12 mb-10 js-only lg:block">
      <fieldset className="flex items-center gap-x-8">
        <legend className="sr-only">
          {z({ en: 'Calculation type', cy: 'Math o gyfrifiad' })}
        </legend>
        <RadioButton
          id="single-desktop"
          name="calculationType-desktop"
          data-testid="single-calculation-radio"
          value="single"
          checked={calculationType === 'single'}
          onChange={() => setCalculationType('single')}
        >
          {z({ en: 'Single calculation', cy: 'Cyfrifiad unigol' })}
        </RadioButton>

        <RadioButton
          id="joint-desktop"
          name="calculationType-desktop"
          data-testid="joint-calculation-radio"
          value="joint"
          checked={calculationType === 'joint'}
          onChange={() => setCalculationType('joint')}
        >
          {z({ en: 'Compare two salaries', cy: 'Cymharwch ddau gyflog' })}
        </RadioButton>
      </fieldset>
    </div>
  );
};
