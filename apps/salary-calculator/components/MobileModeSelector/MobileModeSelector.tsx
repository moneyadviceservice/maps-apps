import { H1 } from '@maps-react/common/components/Heading';
import { RadioButton } from '@maps-react/form/components/RadioButton';
import useTranslation from '@maps-react/hooks/useTranslation';

type CalculationType = 'single' | 'joint';

interface MobileModeSelectorProps {
  showRadioButtons: boolean;
  calculationType: CalculationType;
  handleCalculationTypeChange: (value: CalculationType) => void;
  z: ReturnType<typeof useTranslation>['z'];
}

export const MobileModeSelector: React.FC<MobileModeSelectorProps> = ({
  showRadioButtons,
  calculationType,
  handleCalculationTypeChange,
  z,
}) => {
  if (!showRadioButtons) return null;

  return (
    <div
      className={`col-span-12 py-6 mt-6 border-t-2 border-blue-700 lg:hidden ${
        calculationType === 'single' ? 'border-b-2' : ''
      }`}
    >
      <H1 variant="secondary">
        {z({
          en: 'Compare with another salary?',
          cy: 'Cymharu â chyflog arall?',
        })}
      </H1>

      <div className="flex flex-row gap-6 py-6">
        <RadioButton
          id="joint-mobile"
          name="calculationType-mobile"
          data-testid="joint-calculation-radio-mobile"
          value="joint"
          checked={calculationType === 'joint'}
          onChange={() => handleCalculationTypeChange('joint')}
        >
          {z({ en: 'Yes', cy: 'Ie' })}
        </RadioButton>
        <RadioButton
          id="single-mobile"
          name="calculationType-mobile"
          data-testid="single-calculation-radio-mobile"
          value="single"
          checked={calculationType === 'single'}
          onChange={() => handleCalculationTypeChange('single')}
        >
          {z({ en: 'No', cy: 'Na' })}
        </RadioButton>
      </div>
    </div>
  );
};
