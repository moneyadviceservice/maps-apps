import { PensionCalculatorBase } from 'layouts/PensionCalculatorBase';

import { useTranslation } from '@maps-react/hooks/useTranslation';
export default function IncomePensionsPage() {
  const { z } = useTranslation();
  return (
    <PensionCalculatorBase
      pageHeading={z({ en: 'Pensions that provide an income', cy: '' })}
      showHeading
    >
      <></>
    </PensionCalculatorBase>
  );
}
