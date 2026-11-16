import {
  getMedicalSpecialismLabel,
  radioFieldCoversAll,
  radioFieldSpecialism,
} from 'data/pages/account/tripCover/medical-specialism';
import {
  radioFieldSpec,
  radioFieldTel,
  selectFieldAdvance,
  selectFieldMed,
} from 'data/pages/account/tripCover/service-details';
import {
  getAgePageHeading,
  SUMMARY_COLUMN_LABELS,
  SUMMARY_REGION_LABELS,
  TRIP_COVER_DURATION_SECTIONS,
  TRIP_COVER_REGION_OPTIONS,
} from 'data/pages/account/tripCover/tripCoverConfig';
import type {
  ReviewSummaryRow,
  ReviewSummarySection,
} from 'lib/account/shared/reviewSummary';
import {
  ageLimitsPath,
  buildTripCoverSteps,
  findTripCoverForStep,
  medicalSpecialismPath,
  regionsPath,
  serviceDetailsPath,
} from 'lib/account/tripCover/steps';
import type {
  CoverArea,
  MedicalSpecialisms,
  ServiceDetails,
  TravelInsuranceFirmDocument,
  TripCoverAdvance,
} from 'types/travel-insurance-firm';

import { formatAdvanceToFormValue } from '../serviceDetails/serviceDetailsFormValues';
import { formatYesNoToFormValue } from '../shared/formValues';
import { formatDurationBucketDisplay } from '../tripCoverAgeLimits/formatAgeLimitDisplay';

const SERVICE_DETAIL_SUMMARY_FIELDS = [
  {
    key: radioFieldTel.key,
    heading: 'Do you offer a telephone quote service?',
    options: radioFieldTel.options,
  },
  {
    key: radioFieldSpec.key,
    heading: 'Do you cover specialist medical equipment?',
    options: radioFieldSpec.options,
  },
  {
    key: selectFieldMed.key,
    heading: 'Your medical screening provider',
    options: selectFieldMed.options.map((option) => ({
      label: option.text,
      value: option.value,
    })),
  },
  {
    key: selectFieldAdvance.key,
    heading: 'How far in advance do you provide cover?',
    options: selectFieldAdvance.options.map((option) => ({
      label: option.text,
      value: option.value,
    })),
  },
] as const;

function formatYesNoAnswer(
  stored: boolean | string | null | undefined,
): string {
  const formValue = formatYesNoToFormValue(stored ?? null);
  if (!formValue) {
    return '';
  }

  return formValue === 'yes' ? 'Yes' : 'No';
}

function formatServiceDetailAnswer(
  serviceDetails: ServiceDetails,
  key: (typeof SERVICE_DETAIL_SUMMARY_FIELDS)[number]['key'],
  options: readonly { label: string; value: string }[],
): string {
  const raw = serviceDetails[key as keyof ServiceDetails];
  if (raw == null || raw === '') {
    return '';
  }

  if (key === radioFieldTel.key || key === radioFieldSpec.key) {
    return formatYesNoAnswer(raw as boolean | string);
  }

  if (key === selectFieldAdvance.key) {
    const formValue = formatAdvanceToFormValue(raw as TripCoverAdvance);
    if (!formValue) {
      return String(raw);
    }

    const match = options.find((option) => option.value === formValue);
    return match?.label ?? String(raw);
  }

  const value = String(raw);
  const match = options.find(
    (option) => option.value === value || option.label === value,
  );

  return match?.label ?? value;
}

function buildMedicalSpecialismSummaryRows(
  medicalSpecialisms: MedicalSpecialisms | undefined,
  changeTargetPath: string,
): ReviewSummaryRow[] {
  const coversAll =
    medicalSpecialisms?.specialised_medical_conditions_covers_all;
  const rows: ReviewSummaryRow[] = [
    {
      id: `medical-specialism-${radioFieldCoversAll.key}`,
      heading: radioFieldCoversAll.heading ?? radioFieldCoversAll.title,
      answer: formatYesNoAnswer(coversAll),
      changeTargetPath,
    },
  ];

  if (coversAll === false) {
    rows.push({
      id: `medical-specialism-${radioFieldSpecialism.key}`,
      heading: radioFieldSpecialism.heading ?? radioFieldSpecialism.title,
      answer: getMedicalSpecialismLabel(
        medicalSpecialisms?.specialised_medical_conditions_cover,
      ),
      changeTargetPath,
    });
  }

  return rows;
}

function buildRegionSummaryRows(
  firmId: string,
  selectedAreas: Set<CoverArea>,
): ReviewSummaryRow[] {
  return TRIP_COVER_REGION_OPTIONS.map((region) => ({
    id: `region-${region.value}`,
    heading: SUMMARY_REGION_LABELS[region.value],
    answer: selectedAreas.has(region.value) ? 'Selected' : 'Not selected',
    changeTargetPath: regionsPath(firmId),
  }));
}

export function buildCoverServiceSummary(
  firmId: string,
  firm: TravelInsuranceFirmDocument,
): ReviewSummarySection[] {
  const tripCovers = firm.trip_covers ?? [];
  const selectedAreas = new Set(tripCovers.map((cover) => cover.cover_area));
  const sections: ReviewSummarySection[] = [];

  // Future: add "Are age limits the same across all regions?" row when that question exists.

  sections.push({
    heading: 'Age limits',
    questionColumnLabel: SUMMARY_COLUMN_LABELS.ageLimitRegions,
    answerColumnLabel: SUMMARY_COLUMN_LABELS.selection,
    rows: buildRegionSummaryRows(firmId, selectedAreas),
  });

  for (const step of buildTripCoverSteps(tripCovers)) {
    const matchingCover = findTripCoverForStep(tripCovers, step);
    const ageLimits = matchingCover?.age_limits;
    const changeTargetPath = ageLimitsPath(
      firmId,
      step.coverArea,
      step.tripType,
    );

    const rows: ReviewSummaryRow[] = TRIP_COVER_DURATION_SECTIONS.map(
      ({ bucket, label }) => ({
        id: `${step.coverArea}-${step.tripType}-${bucket}`,
        heading: label,
        answer: formatDurationBucketDisplay(ageLimits, bucket),
        changeTargetPath,
      }),
    );

    sections.push({
      heading: getAgePageHeading(step.coverArea, step.tripType),
      questionColumnLabel: SUMMARY_COLUMN_LABELS.ageLimitQuestions,
      answerColumnLabel: SUMMARY_COLUMN_LABELS.selection,
      rows,
    });
  }

  sections.push({
    heading: 'Medical Specialism',
    questionColumnLabel: SUMMARY_COLUMN_LABELS.medicalSpecialismQuestions,
    answerColumnLabel: SUMMARY_COLUMN_LABELS.selection,
    rows: buildMedicalSpecialismSummaryRows(
      firm.medical_specialisms,
      medicalSpecialismPath(firmId),
    ),
  });

  const changeTargetPath = serviceDetailsPath(firmId);
  const serviceRows: ReviewSummaryRow[] = SERVICE_DETAIL_SUMMARY_FIELDS.map(
    (field) => ({
      id: `service-details-${field.key}`,
      heading: field.heading,
      answer: formatServiceDetailAnswer(
        firm.service_details,
        field.key,
        field.options,
      ),
      changeTargetPath,
    }),
  );

  sections.push({
    heading: 'Service details',
    questionColumnLabel: SUMMARY_COLUMN_LABELS.serviceDetailsQuestions,
    answerColumnLabel: SUMMARY_COLUMN_LABELS.selection,
    rows: serviceRows,
  });

  return sections;
}
