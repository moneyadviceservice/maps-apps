import {
  expectAccountFormApiSubmit,
  mockAccountFormFetchSuccess,
  setupAccountFormComponentTest,
} from 'lib/account/testing/accountFormComponentTestSetup';
import { confirmPath, serviceDetailsPath } from 'lib/account/tripCover/steps';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MedicalSpecialism } from './MedicalSpecialism';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('hooks/useErrorSummary', () => ({
  useErrorSummary: jest.fn(),
}));

globalThis.fetch = jest.fn();

describe('MedicalSpecialism Component', () => {
  const { mockPush } = setupAccountFormComponentTest();
  const firmId = 'firm-123';

  it('submits to the medical-specialism API and routes to service details', async () => {
    const user = userEvent.setup();
    mockAccountFormFetchSuccess();

    render(<MedicalSpecialism firmId={firmId} />);

    await user.click(screen.getByLabelText('Yes'));
    fireEvent.submit(screen.getByTestId('medical-specialism'));

    await expectAccountFormApiSubmit({
      apiUrl: '/api/account/trip-cover/medical-specialism',
      expectedBody: {
        updatePath: 'medical_specialisms',
        firmId,
        specialised_medical_conditions_covers_all: 'yes',
      },
      nextPath: serviceDetailsPath(firmId),
      mockPush,
    });
  });

  it('submits with isChangeAnswer when editing from summary', async () => {
    mockAccountFormFetchSuccess(confirmPath(firmId));

    render(<MedicalSpecialism firmId={firmId} isChangeAnswer />);
    fireEvent.submit(screen.getByTestId('medical-specialism'));

    await expectAccountFormApiSubmit({
      apiUrl: '/api/account/trip-cover/medical-specialism?isChangeAnswer=true',
      expectedBody: {
        updatePath: 'medical_specialisms',
        firmId,
        isChangeAnswer: 'true',
      },
      nextPath: confirmPath(firmId),
      mockPush,
    });
  });
});
