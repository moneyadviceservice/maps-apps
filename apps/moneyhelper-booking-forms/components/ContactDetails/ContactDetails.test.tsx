import { render } from '@testing-library/react';

import { mockEntry } from '@maps-react/mhf/mocks';
import { getFieldError } from '@maps-react/mhf/utils';

import { ContactDetails } from '.';
import { FlowName, StepName } from '../../lib/constants';
import { describeEachLanguage } from '../../test';

jest.mock('@maps-react/hooks/useLanguage', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('@maps-react/mhf/utils');

describeEachLanguage('ContactDetails', () => {
  beforeEach(() => {
    (getFieldError as jest.Mock).mockReturnValue(undefined);
  });

  it('renders component correctly', () => {
    const { container } = render(
      <ContactDetails step={StepName.CONTACT_DETAILS} entry={mockEntry} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders component correctly with errors', () => {
    (getFieldError as jest.Mock).mockReturnValue(true);
    const { container } = render(
      <ContactDetails step={StepName.CONTACT_DETAILS} entry={mockEntry} />,
    );
    expect(container).toMatchSnapshot();
  });

  it.each([
    [true, FlowName.PENSION_WISE, StepName.CONFIRM_DETAILS],
    [true, FlowName.SELF_EMPLOYED, StepName.CONFIRM_DETAILS],
    [false, FlowName.PENSION_WISE, StepName.PENSION_WISE_DIGITAL_APPOINTMENT],
    [false, FlowName.SELF_EMPLOYED, StepName.COMMUNICATION_PREFERENCES],
    [
      undefined,
      FlowName.PENSION_WISE,
      StepName.PENSION_WISE_DIGITAL_APPOINTMENT,
    ],
    [undefined, FlowName.SELF_EMPLOYED, StepName.COMMUNICATION_PREFERENCES],
  ] as const)(
    'when editMode is %s and flow is "%s", nextStep is "%s"',
    (editMode, flow, expectedNextStep) => {
      const { container } = render(
        <ContactDetails
          step={StepName.CONTACT_DETAILS}
          flow={flow}
          entry={{ ...mockEntry, editMode, data: { ...mockEntry.data, flow } }}
        />,
      );

      const nextStepInput = container.querySelector<HTMLInputElement>(
        'input[name="nextStep"]',
      );
      expect(nextStepInput?.value).toBe(expectedNextStep);
    },
  );
});
