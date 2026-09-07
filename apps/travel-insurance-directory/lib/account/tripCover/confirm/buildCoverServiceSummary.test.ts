import { createMockFirm } from 'components/FirmSummary/mockFirm';
import { emptyServiceDetails } from 'lib/firms/firmDefaults';
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
      questionColumnLabel: 'Service details questions',
    });
    expect(sections[1].rows).toHaveLength(3);
    expect(sections[1].rows[0]).toMatchObject({
      heading: 'Up to 30 days',
      answer: '75',
    });

    expect(sections[2]).toMatchObject({
      heading: 'Service details',
    });
    expect(sections[2].rows).toHaveLength(4);
    expect(sections[2].rows[0]).toMatchObject({
      heading: 'Do you offer a telephone quote service?',
      answer: 'Yes',
    });
  });
});
