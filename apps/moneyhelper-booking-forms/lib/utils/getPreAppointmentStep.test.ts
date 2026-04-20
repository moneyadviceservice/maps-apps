import { mockEntry } from '@maps-react/mhf/mocks';
import { EntryData } from '@maps-react/mhf/types';

import { FlowName, StepName } from '../constants';
import { getPreAppointmentStep } from './getPreAppointmentStep';

describe('getPreAppointmentStep', () => {
  it('returns PENSION_WISE_PRE_APPOINTMENT for pension-wise flow', () => {
    expect(
      getPreAppointmentStep({
        ...mockEntry,
        data: { flow: FlowName.PENSION_WISE } as EntryData,
      }),
    ).toBe(StepName.PENSION_WISE_PRE_APPOINTMENT);
  });

  it('returns SELF_EMPLOYED_PRE_APPOINTMENT for self-employed flow', () => {
    expect(
      getPreAppointmentStep({
        ...mockEntry,
        data: { flow: FlowName.SELF_EMPLOYED } as EntryData,
      }),
    ).toBe(StepName.SELF_EMPLOYED_PRE_APPOINTMENT);
  });

  it('returns DIVORCE_PRE_APPOINTMENT for divorce-separation flow', () => {
    expect(
      getPreAppointmentStep({
        ...mockEntry,
        data: { flow: FlowName.DIVORCE_SEPARATION } as EntryData,
      }),
    ).toBe(StepName.DIVORCE_PRE_APPOINTMENT);
  });

  it('returns PENSION_LOSS_PRE_APPOINTMENT for pension-loss flow', () => {
    expect(
      getPreAppointmentStep({
        ...mockEntry,
        data: { flow: FlowName.PENSION_LOSS } as EntryData,
      }),
    ).toBe(StepName.PENSION_LOSS_PRE_APPOINTMENT);
  });

  it('throws when flow is undefined', () => {
    expect(() => getPreAppointmentStep(undefined)).toThrow(
      '[getPreAppointmentStep] Flow missing from entry data.',
    );
  });

  it('throws when flow is not mapped', () => {
    expect(() =>
      getPreAppointmentStep({
        ...mockEntry,
        data: { flow: FlowName.BASE } as EntryData,
      }),
    ).toThrow('No pre-appointment step mapping found for flow: base');
  });
});
