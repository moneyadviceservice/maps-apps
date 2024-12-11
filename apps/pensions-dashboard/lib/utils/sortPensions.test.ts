import { PensionType } from '../constants';
import { PensionArrangement } from '../types';
import { sortPensions } from './sortPensions';

describe('sortPensions', () => {
  test('should sort pensions by administrator name and scheme name', () => {
    // Arrange
    const pensions: PensionArrangement[] = [
      {
        pensionAdministrator: { name: 'Name B' },
        schemeName: 'Scheme B',
        pensionType: PensionType.DC,
      } as PensionArrangement,
      {
        pensionAdministrator: { name: 'Name A' },
        schemeName: 'Scheme A',
        pensionType: PensionType.DC,
      } as PensionArrangement,
      {
        pensionAdministrator: { name: 'Name A' },
        schemeName: 'Scheme B',
        pensionType: PensionType.DC,
      } as PensionArrangement,
    ];

    // Act
    const sortedPensions = sortPensions(pensions);

    // Assert
    expect(sortedPensions).toEqual([
      {
        pensionAdministrator: { name: 'Name A' },
        schemeName: 'Scheme A',
        pensionType: PensionType.DC,
      },
      {
        pensionAdministrator: { name: 'Name A' },
        schemeName: 'Scheme B',
        pensionType: PensionType.DC,
      },
      {
        pensionAdministrator: { name: 'Name B' },
        schemeName: 'Scheme B',
        pensionType: PensionType.DC,
      },
    ]);
  });

  test('should move State Pension to the top', () => {
    // Arrange
    const pensions: PensionArrangement[] = [
      {
        pensionAdministrator: { name: 'Name B' },
        schemeName: 'Scheme B',
        pensionType: PensionType.DC,
      } as PensionArrangement,
      {
        pensionAdministrator: { name: 'Name A' },
        schemeName: 'Scheme A',
        pensionType: PensionType.SP,
      } as PensionArrangement,
      {
        pensionAdministrator: { name: 'Name A' },
        schemeName: 'Scheme B',
        pensionType: PensionType.DC,
      } as PensionArrangement,
    ];

    // Act
    const sortedPensions = sortPensions(pensions);

    // Assert
    expect(sortedPensions).toEqual([
      {
        pensionAdministrator: { name: 'Name A' },
        schemeName: 'Scheme A',
        pensionType: PensionType.SP,
      },
      {
        pensionAdministrator: { name: 'Name A' },
        schemeName: 'Scheme B',
        pensionType: PensionType.DC,
      },
      {
        pensionAdministrator: { name: 'Name B' },
        schemeName: 'Scheme B',
        pensionType: PensionType.DC,
      },
    ]);
  });
});
