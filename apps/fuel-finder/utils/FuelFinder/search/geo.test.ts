import { boundingBox, getDistanceInMiles } from './geo';

describe('getDistanceInMiles', () => {
  it('returns 0 for same coordinates', () => {
    expect(getDistanceInMiles(51.5, -0.1, 51.5, -0.1)).toBe(0);
  });

  it('calculates distance between London and Manchester', () => {
    const distance = getDistanceInMiles(51.5074, -0.1278, 53.4808, -2.2426);
    expect(distance).toBeGreaterThan(160);
    expect(distance).toBeLessThan(165);
  });

  it('calculates short distance accurately', () => {
    // ~1 mile apart approximately
    const distance = getDistanceInMiles(51.5, -0.1, 51.5145, -0.1);
    expect(distance).toBeGreaterThan(0.9);
    expect(distance).toBeLessThan(1.1);
  });
});

describe('boundingBox', () => {
  it('returns a bounding box around given coordinates', () => {
    const box = boundingBox(51.5, -0.1, 10);
    expect(box.minLat).toBeLessThan(51.5);
    expect(box.maxLat).toBeGreaterThan(51.5);
    expect(box.minLng).toBeLessThan(-0.1);
    expect(box.maxLng).toBeGreaterThan(-0.1);
  });

  it('produces symmetrical bounds around center', () => {
    const box = boundingBox(51.5, -0.1, 10);
    const latRange = box.maxLat - box.minLat;
    const center = (box.maxLat + box.minLat) / 2;
    expect(center).toBeCloseTo(51.5, 5);
    expect(latRange).toBeGreaterThan(0);
  });

  it('produces larger box for larger radius', () => {
    const small = boundingBox(51.5, -0.1, 5);
    const large = boundingBox(51.5, -0.1, 50);
    expect(large.maxLat - large.minLat).toBeGreaterThan(
      small.maxLat - small.minLat,
    );
  });
});
