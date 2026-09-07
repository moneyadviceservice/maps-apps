jest.mock('lib/firms/updateFirm', () => ({
  updateFirm: jest.fn(),
}));

jest.mock('lib/account/tradingFirm', () => ({
  fetchTradingDocsByMainFirmId: jest.fn(),
}));

import {
  createMockFirm,
  createMockTradingFirm,
} from 'components/FirmSummary/mockFirm';
import { getAdminDirectoryStatusActionUrl } from 'lib/admin/detail/directoryStatus/directoryStatus';
import { getAdminReregisterActionUrl } from 'lib/admin/detail/reregistration/reregistration';
import {
  HIDDEN_DUE_TO_FCA,
  HIDDEN_DUE_TO_TRADING_NAME,
} from 'lib/firms/fcaVisibility';
import { Office } from 'types/travel-insurance-firm';
import { render, screen } from '@testing-library/react';

import { FirmDetail } from './FirmDetail';

import '@testing-library/jest-dom';

const principal = {
  first_name: 'Andrew',
  last_name: 'Jackson',
  job_title: null,
  email_address: 'andrew@example.com',
  telephone_number: '01234567890',
  confirmed_disclaimer: true,
  senior_manager_name: null,
  individual_reference_number: 'IRN001',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const mockedFirm = createMockFirm();
const mockedFirmOffice = mockedFirm.office ?? {
  contact: { website: '', email_address: '', telephone_number: '' },
};

describe('FirmDetail', () => {
  it('does not show Document type row', () => {
    render(<FirmDetail firm={createMockFirm({ id: 'main-1' })} />);

    expect(screen.queryByText('Document type')).not.toBeInTheDocument();
  });

  it('shows principal and website from main firm document', () => {
    const main = createMockFirm({
      id: 'main-1',
      principal,
      website_address: 'https://top.example',
      office: {
        ...mockedFirmOffice,
        contact: {
          ...mockedFirmOffice.contact,
          website: 'https://contact.example',
        },
      } as Office,
    });

    render(<FirmDetail firm={main} />);

    expect(screen.getByText('Andrew Jackson')).toBeInTheDocument();
    expect(screen.getByText('andrew@example.com')).toBeInTheDocument();
    expect(screen.getByText('01234567890')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /https:\/\/contact\.example/ }),
    ).toHaveAttribute('href', 'https://contact.example');
  });

  it('inherits principal and website from mainFirm for trading document', () => {
    const main = createMockFirm({
      id: 'main-1',
      fca_number: 610022,
      principal,
      website_address: 'https://main.example',
      office: {
        ...mockedFirmOffice,
        contact: {
          ...mockedFirmOffice.contact,
          website: 'https://main-contact.example',
        },
      } as Office,
      reregistered_at: '2024-11-21T10:18:00Z',
      reregister_approved_at: '2024-12-24T11:19:00Z',
    });
    const trading = createMockTradingFirm({
      id: 'trading-1',
      fca_number: 610022,
      main_firm_id: 'main-1',
      registered_name: 'Trading Brand',
      website_address: null,
      office: null,
    });

    render(<FirmDetail firm={trading} mainFirm={main} />);

    expect(screen.getByText('Andrew Jackson')).toBeInTheDocument();
    expect(screen.getByText('andrew@example.com')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /https:\/\/main-contact\.example/ }),
    ).toHaveAttribute('href', 'https://main-contact.example');
    expect(screen.getByText('Reregistered')).toBeInTheDocument();
    expect(screen.getByText('Reregistration Approved')).toBeInTheDocument();
  });

  it('shows dashes for principal when trading has no mainFirm', () => {
    const trading = createMockTradingFirm({ id: 'trading-1' });

    render(<FirmDetail firm={trading} />);

    const principalCells = screen.getAllByText('—');
    expect(principalCells.length).toBeGreaterThanOrEqual(3);
    expect(screen.queryByText('Reregistered')).not.toBeInTheDocument();
  });

  it('renders Add to Directory and Hide from Directory actions when enabled', () => {
    const firm = createMockFirm({ id: 'firm-actions' });

    render(
      <FirmDetail firm={firm} showApproveButton={true} showHideButton={true} />,
    );

    expect(
      screen.getByRole('button', { name: 'Add to Directory' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Hide from Directory' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add to Directory' }).closest('form'),
    ).toHaveAttribute(
      'action',
      getAdminDirectoryStatusActionUrl('firm-actions', 'approve'),
    );
    expect(
      screen
        .getByRole('button', { name: 'Hide from Directory' })
        .closest('form'),
    ).toHaveAttribute(
      'action',
      getAdminDirectoryStatusActionUrl('firm-actions', 'hide'),
    );
  });

  it('renders Re-register action when enabled', () => {
    const firm = createMockFirm({ id: 'firm-reregister' });

    render(<FirmDetail firm={firm} showReregisterButton={true} />);

    expect(
      screen.getByRole('button', { name: 'Re-register' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Re-register' }).closest('form'),
    ).toHaveAttribute('action', getAdminReregisterActionUrl('firm-reregister'));
  });

  it('does not render admin actions by default', () => {
    render(<FirmDetail firm={createMockFirm({ id: 'firm-no-actions' })} />);

    expect(
      screen.queryByRole('button', { name: 'Add to Directory' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Hide from Directory' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Re-register' }),
    ).not.toBeInTheDocument();
  });

  it('shows Status row with directory status label', () => {
    render(
      <FirmDetail
        firm={createMockFirm({
          id: 'firm-status',
          status: 'hidden',
          hidden_reason: HIDDEN_DUE_TO_FCA,
        })}
      />,
    );

    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('No longer authorised')).toBeInTheDocument();
  });

  it('shows No longer valid status for trading-name block', () => {
    render(
      <FirmDetail
        firm={createMockTradingFirm({
          id: 'trading-status',
          status: 'hidden',
          hidden_reason: HIDDEN_DUE_TO_TRADING_NAME,
        })}
      />,
    );

    expect(screen.getByText('No longer valid')).toBeInTheDocument();
  });
});
