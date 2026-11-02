import { getKeyboardInstructions } from './content';

const zEn = (value: { en: string; cy: string }) => value.en;
const zCy = (value: { en: string; cy: string }) => value.cy;

describe('AppointmentDateTime content helpers', () => {
  it('returns keyboard instructions in English', () => {
    expect(getKeyboardInstructions(zEn)).toContain(
      'Use arrow keys to move through days',
    );
  });

  it('returns keyboard instructions in Welsh', () => {
    expect(getKeyboardInstructions(zCy)).toContain(
      'Defnyddiwch y saethau i symud rhwng dyddiau',
    );
  });
});
