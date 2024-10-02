import { pensionPotChunkTax } from './pensionPotChunkTax';

describe('pensionPotChunkTax', () => {
  it('should pensionPotChunkTax for 10000 chunk', () => {
    const result = pensionPotChunkTax(0, 100000, 20000);
    expect(result).toEqual({
      amount: 19514,
      remainingPot: 80000,
      taxDue: 486,
    });
  });

  it('should pensionPotChunkTax for 40000 chunk', () => {
    const result = pensionPotChunkTax(0, 100000, 40000);

    expect(result).toEqual({
      amount: 36514,
      remainingPot: 60000,
      taxDue: 3486,
    });
  });

  it('should pensionPotChunkTax for 70000 chunk', () => {
    const result = pensionPotChunkTax(0, 100000, 70000);

    expect(result).toEqual({
      amount: 61568,
      remainingPot: 30000,
      taxDue: 8432,
    });
  });

  it('should pensionPotChunkTax for 160000 chunk', () => {
    const result = pensionPotChunkTax(0, 200000, 160000);

    expect(result).toEqual({
      amount: 120568,
      remainingPot: 40000,
      taxDue: 39432,
    });
  });

  it('should pensionPotChunkTax for salary 20000 20000 chunk', () => {
    const result = pensionPotChunkTax(20000, 200000, 20000);

    expect(result).toEqual({
      amount: 17000,
      remainingPot: 180000,
      taxDue: 3000,
    });
  });

  it('should pensionPotChunkTax for salary 30000 25000 chunk', () => {
    const result = pensionPotChunkTax(30000, 200000, 25000);

    expect(result).toEqual({
      amount: 21250,
      remainingPot: 175000,
      taxDue: 3750,
    });
  });
});
