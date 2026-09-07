import {
  parseContractualRedundancy,
  ContractualRedundancyProvided,
} from './parseStoredData';

describe('parseContractualRedundancy', () => {
  it('should return provided as "Yes" and the correct amount when redundancy is provided', () => {
    const q6 = '0'; // Answered Yes to Contractual redundancy pay in Q6
    const q7 = '20,000,0'; // Entered 20000 in Q7

    const result = parseContractualRedundancy(q6, q7);

    const expected = {
      provided: ContractualRedundancyProvided.Yes,
      amount: 200000,
    };

    expect(result).toEqual(expected);
  });

  it('should return provided as "Unknown" and amount as "Unknown" when q7 is ",1"', () => {
    const q6 = '0'; // Answered Yes to Contractual redundancy pay in Q6
    const q7 = ',1'; // Chose I dont know in Q7

    const result = parseContractualRedundancy(q6, q7);

    const expected = {
      provided: ContractualRedundancyProvided.Unknown,
      amount: 0,
    };

    expect(result).toEqual(expected);
  });
});
