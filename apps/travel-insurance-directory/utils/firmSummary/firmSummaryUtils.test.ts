import { emptyMedicalSpecialisms } from 'lib/firms/firmDefaults';
import type { MedicalSpecialismCover } from 'types/travel-insurance-firm';

import { getMedicalConditionsText, type Z } from './firmSummaryUtils';

const enZ = ((t: { en: string; cy: string }) => t.en) as Z;
const cyZ = ((t: { en: string; cy: string }) => t.cy) as Z;

const namedSpecialism = (cover: MedicalSpecialismCover) => ({
  ...emptyMedicalSpecialisms(),
  specialised_medical_conditions_covers_all: false as const,
  specialised_medical_conditions_cover: cover,
});

describe('getMedicalConditionsText', () => {
  it.each([
    ['cancer', 'Specialises in cancer', 'Yn arbenigo mewn canser'],
    [
      'heart_conditions',
      'Specialises in heart conditions',
      "Yn arbenigo mewn cyflyrau'r galon",
    ],
    [
      'strokes_or_cns_disorders',
      'Specialises in strokes or central nervous system disorders',
      "Yn arbenigo mewn strôc neu anhwylderau'r system nerfol ganolog",
    ],
    [
      'respiratory_problems',
      'Specialises in respiratory problems',
      'Yn arbenigo mewn problemau anadlol',
    ],
    [
      'psychological_or_mental_health_problems',
      'Specialises in psychological or mental health problems',
      'Yn arbenigo mewn problemau seicolegol neu iechyd meddwl',
    ],
  ] as const)('maps %s to the prefixed listing copy', (cover, en, cy) => {
    const specialisms = namedSpecialism(cover);

    expect(getMedicalConditionsText(specialisms, null, enZ)).toBe(en);
    expect(getMedicalConditionsText(specialisms, null, cyZ)).toBe(cy);
  });
});
