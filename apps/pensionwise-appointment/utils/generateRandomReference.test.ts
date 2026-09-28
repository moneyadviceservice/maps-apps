import {
  generateRandomReference,
  getRandomCharacters,
} from './generateRandomReference';

describe('generateRandomReference', () => {
  it('should generate a random reference number', () => {
    expect(generateRandomReference()).toMatch(/P[A-Z]{2}\d-\d[A-Z]{3}/);
  });

  it('should generate unique reference numbers', () => {
    const referenceNumbers = new Set();
    for (let i = 0; i < 300; i++) {
      referenceNumbers.add(generateRandomReference());
    }

    expect(referenceNumbers.size).toBe(300);
    referenceNumbers.forEach((referenceNumber, i) => {
      expect(referenceNumber).toHaveLength(9);
      expect(referenceNumber).toMatch(/P[^ILOQ]{2}\d-\d[^OQIL]{3}/);

      referenceNumbers.forEach((otherReferenceNumber, j) => {
        if (i === j) return;
        expect(referenceNumber).not.toBe(otherReferenceNumber);
      });
    });
  });
  it('should generate a random reference number', () => {
    expect(getRandomCharacters('ABC', 2)).toMatch(/[ABC]{2}/);
  });
});
