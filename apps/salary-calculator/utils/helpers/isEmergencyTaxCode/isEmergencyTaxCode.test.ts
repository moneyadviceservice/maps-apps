import { isEmergencyTaxCode } from './isEmergencyTaxCode';

describe('isEmergencyTaxCode', () => {
  it.each(['1257LW1', 'S1257LM1', 'C663LX', 'K475W1', 'BRX', 'NTX'])(
    'returns true for emergency tax code %s',
    (taxCode) => {
      expect(isEmergencyTaxCode(taxCode)).toBe(true);
    },
  );

  it.each(['1257L', 'S1257L', 'K475', 'BR', 'NT', '0T', '', undefined])(
    'returns false for %s',
    (taxCode) => {
      expect(isEmergencyTaxCode(taxCode)).toBe(false);
    },
  );
});
