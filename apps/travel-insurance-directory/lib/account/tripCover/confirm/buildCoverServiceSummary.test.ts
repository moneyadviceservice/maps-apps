import { createMockFirm } from 'components/FirmSummary/mockFirm';
import {
  coversAllMedicalSpecialisms,
  emptyMedicalSpecialisms,
  emptyServiceDetails,
} from 'lib/firms/firmDefaults';
import { tripCoverWithAgeLimits } from 'lib/firms/testing/tripCoverFixtures';

import { buildCoverServiceSummary } from './buildCoverServiceSummary';

describe('buildCoverServiceSummary', () => {
  it('builds per-region rows and three duration rows per age step', () => {
    const firm = createMockFirm({
      id: 'firm-123',
      trip_covers: [
        tripCoverWithAgeLimits(
          { up_to_30_days: { land: 75, cruise: 75 } },
          { cover_area: 'uk_and_europe', trip_type: 'single_trip' },
        ),
      ],
      service_details: {
        ...emptyServiceDetails(),
        offers_telephone_quote: true,
        will_cover_specialist_equipment: true,
        medical_screening_company: 'verisk',
        how_far_in_advance_trip_cover: 'up_to_18_month',
      },
      medical_specialisms: coversAllMedicalSpecialisms(),
    });

    const sections = buildCoverServiceSummary('firm-123', firm);

    expect(sections[0]).toMatchObject({
      heading: 'Age limits',
      questionColumnLabel: 'Age limit regions',
      answerColumnLabel: 'Selection',
    });
    expect(sections[0].rows).toHaveLength(3);
    expect(sections[0].rows[0]).toMatchObject({
      heading: 'Europe',
      answer: 'Selected',
      changeTargetPath: '/account/trip-cover/regions/firm-123',
    });
    expect(sections[0].rows[1]).toMatchObject({
      heading: 'Worldwide Excl. USA',
      answer: 'Not selected',
    });
    expect(sections[0].rows[2]).toMatchObject({
      heading: 'Worldwide Incl. USA',
      answer: 'Not selected',
    });

    expect(sections[1]).toMatchObject({
      heading: 'Set age for Europe single trip',
      questionColumnLabel: 'Age limit questions',
    });
    expect(sections[1].rows).toHaveLength(3);
    expect(sections[1].rows[0]).toMatchObject({
      heading: 'Up to 30 days',
      answer: '75',
    });

    expect(sections[2]).toMatchObject({
      heading: 'Medical Specialism',
    });
    expect(sections[2].rows).toHaveLength(1);
    expect(sections[2].rows[0]).toMatchObject({
      heading:
        'Do you offer travel insurance that will cover any/most types of serious medical conditions?',
      answer: 'Yes',
      changeTargetPath: '/account/trip-cover/medical-specialism/firm-123',
    });

    expect(sections[3]).toMatchObject({
      heading: 'Service details',
    });
    expect(sections[3].rows).toHaveLength(4);
    expect(sections[3].rows[0]).toMatchObject({
      heading: 'Do you offer a telephone quote service?',
      answer: 'Yes',
      changeTargetPath: '/account/trip-cover/service-details/firm-123',
    });
  });

  it('includes the specialism row when the firm does not cover all conditions', () => {
    const firm = createMockFirm({
      id: 'firm-123',
      trip_covers: [],
      service_details: {
        ...emptyServiceDetails(),
        offers_telephone_quote: true,
        will_cover_specialist_equipment: true,
        medical_screening_company: 'verisk',
        how_far_in_advance_trip_cover: 'up_to_18_month',
      },
      medical_specialisms: {
        ...emptyMedicalSpecialisms(),
        specialised_medical_conditions_covers_all: false,
        specialised_medical_conditions_cover: 'cancer',
      },
    });

    const sections = buildCoverServiceSummary('firm-123', firm);
    const medicalSection = sections.find(
      (section) => section.heading === 'Medical Specialism',
    );

    expect(medicalSection?.rows).toHaveLength(2);
    expect(medicalSection?.rows[0]).toMatchObject({
      heading:
        'Do you offer travel insurance that will cover any/most types of serious medical conditions?',
      answer: 'No',
      changeTargetPath: '/account/trip-cover/medical-specialism/firm-123',
    });
    expect(medicalSection?.rows[1]).toMatchObject({
      heading: 'Which medical condition does your firm specialise in?',
      answer: 'Cancer',
    });
  });
});
