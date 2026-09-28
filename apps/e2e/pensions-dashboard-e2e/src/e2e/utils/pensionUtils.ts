import { PensionData } from '../types/pension.types';

interface ExpectedPensionParams {
  schemeName: string;
  pensionType: string;
  matchType: string;
  category: string;
}

export class PensionDataValidator {
  private readonly pensionData: PensionData[];

  constructor(pensionsData: PensionData[]) {
    this.pensionData = pensionsData;
  }

  hasPension(expectedData: ExpectedPensionParams): boolean {
    const matchingPension = this.pensionData.find((pension) => {
      return (
        pension.schemeName === expectedData.schemeName &&
        pension.category === expectedData.category &&
        pension.matchType === expectedData.matchType &&
        pension.pensionType === expectedData.pensionType
      );
    });

    return !!matchingPension;
  }
}
