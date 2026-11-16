import { createMockFirm } from 'components/FirmSummary/mockFirm';
import { accountFirmRowLabels } from 'data/pages/account/tradingNames';
import { FirmLayout } from 'layouts/FirmLayout';
import { emptySpecificConditions } from 'lib/firms/firmDefaults';
import { render, screen } from '@testing-library/react';

import { buildAccountFirmLayoutProps } from './buildAccountFirmLayoutProps';

import '@testing-library/jest-dom';

describe('buildAccountFirmLayoutProps', () => {
  it('renders registration incomplete callout', () => {
    const firm = createMockFirm({ status: 'hidden' });
    const props = buildAccountFirmLayoutProps({
      firm,
      showRegistrationResumeCallout: true,
      registrationIncomplete: true,
      resumeRegistrationHref: '/register/firm/step1',
    });

    expect(props.callout).toBeDefined();
    expect(props.firmBlockRowLabels).toEqual(accountFirmRowLabels);

    render(<FirmLayout {...props} />);
    expect(screen.getByText('Registration incomplete')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Continue' })).toHaveAttribute(
      'href',
      '/register/firm/step1',
    );
    expect(screen.getAllByText('Cover and service').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('Customer contact details').length,
    ).toBeGreaterThan(0);
  });

  it('renders registration not approved callout when complete but not pre-approved', () => {
    const props = buildAccountFirmLayoutProps({
      firm: createMockFirm({ status: 'hidden' }),
      showRegistrationResumeCallout: true,
      registrationIncomplete: false,
      resumeRegistrationHref: '/register/confirm-details',
    });

    expect(props.callout).toBeDefined();

    render(<FirmLayout {...props} />);
    expect(screen.getByText('Registration not approved')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Continue' })).toHaveAttribute(
      'href',
      '/register/confirm-details',
    );
  });

  it('omits callout when registration is pre-approved', () => {
    const props = buildAccountFirmLayoutProps({
      firm: createMockFirm({ status: 'hidden' }),
      showRegistrationResumeCallout: false,
      registrationIncomplete: false,
      resumeRegistrationHref: '/register/firm/step1',
    });

    expect(props.callout).toBeUndefined();
  });

  it('renders re-registration banner when pending', () => {
    const props = buildAccountFirmLayoutProps({
      firm: createMockFirm({
        status: 'hidden',
        reregistered_at: '2024-11-21T10:18:00Z',
        reregister_approved_at: null,
      }),
      showReregistrationBanner: true,
      showRegistrationResumeCallout: false,
      registrationIncomplete: false,
      resumeRegistrationHref: '/register/firm/step3',
    });

    render(<FirmLayout {...props} />);
    expect(
      screen.getByText('You need to reregister your firm'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Reregistering will ensure your firm remains in our Travel insurance directory.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get started' })).toHaveAttribute(
      'href',
      '/register/firm/step3',
    );
  });

  it('renders Resume CTA and expiration date when renewal draft exists', () => {
    const props = buildAccountFirmLayoutProps({
      firm: createMockFirm({ status: 'active' }),
      showReregistrationBanner: true,
      showRegistrationResumeCallout: false,
      registrationIncomplete: false,
      resumeRegistrationHref: '/register/scenario/step5',
      hasRenewalDraft: true,
      reregistrationExpirationLabel: '15 January 2026',
      reregistrationCtaHref: '/register/scenario/step5',
    });

    render(<FirmLayout {...props} />);
    expect(
      screen.getByRole('link', { name: 'Resume your reregistration' }),
    ).toHaveAttribute('href', '/register/scenario/step5');
    expect(
      screen.getByText(/Your firm's registration expires on 15 January 2026/),
    ).toBeInTheDocument();
  });

  it('shows both re-registration and registration resume callouts when both apply', () => {
    const firm = createMockFirm({
      status: 'hidden',
      reregistered_at: '2024-11-21T10:18:00Z',
      reregister_approved_at: null,
      medical_coverage: {
        ...createMockFirm().medical_coverage,
        specific_conditions: emptySpecificConditions(),
      },
    });

    const props = buildAccountFirmLayoutProps({
      firm,
      showReregistrationBanner: true,
      showRegistrationResumeCallout: true,
      registrationIncomplete: true,
      resumeRegistrationHref: '/register/firm/step3',
    });

    render(<FirmLayout {...props} />);
    expect(
      screen.getByText('You need to reregister your firm'),
    ).toBeInTheDocument();
    expect(screen.getByText('Registration incomplete')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get started' })).toHaveAttribute(
      'href',
      '/register/firm/step3',
    );
    expect(screen.getByRole('link', { name: 'Continue' })).toHaveAttribute(
      'href',
      '/register/firm/step3',
    );
  });

  it('omits re-registration banner when re-registration is completed', () => {
    const props = buildAccountFirmLayoutProps({
      firm: createMockFirm({
        status: 'hidden',
        reregistered_at: '2024-11-21T10:18:00Z',
        reregister_approved_at: '2024-12-24T11:19:00Z',
      }),
      showReregistrationBanner: false,
      showRegistrationResumeCallout: false,
      registrationIncomplete: false,
      resumeRegistrationHref: '/register/firm/step1',
    });

    expect(props.callout).toBeUndefined();
  });

  it('maps section badges from firm data for cover and contact', () => {
    const props = buildAccountFirmLayoutProps({
      firm: createMockFirm(),
      showRegistrationResumeCallout: false,
      registrationIncomplete: false,
      resumeRegistrationHref: '/register/firm/step1',
    });

    expect(props.mainAuthorisedFirm.coverAndService.sectionStatus).toBe(
      'not_started',
    );
    expect(props.mainAuthorisedFirm.customerContactDetails.sectionStatus).toBe(
      'in_progress',
    );
  });

  it('maps firm fields onto main authorised firm block', () => {
    const props = buildAccountFirmLayoutProps({
      firm: createMockFirm({
        registered_name: 'Mapped Ltd',
        fca_number: 555,
      }),
      showRegistrationResumeCallout: false,
      registrationIncomplete: false,
      resumeRegistrationHref: '/r',
    });

    expect(props.mainAuthorisedFirm.registeredName).toBe('Mapped Ltd');
    expect(props.mainAuthorisedFirm.frn).toBe('555');
    expect(props.mainAuthorisedFirm.registeredNameHref).toBeUndefined();
    expect(props.mainAuthorisedFirm.coverAndService.changeHref).toBe(
      '/account/trip-cover/regions/travel_insurance_firm_mock',
    );
    expect(props.mainAuthorisedFirm.customerContactDetails.changeHref).toBe(
      '/account/firm-details/customer-contact-details/travel_insurance_firm_mock',
    );
  });

  it('uses empty strings when registered_name and fca_number are missing', () => {
    const props = buildAccountFirmLayoutProps({
      firm: createMockFirm({
        registered_name: undefined,
        fca_number: undefined as unknown as number,
      }),
      showRegistrationResumeCallout: false,
      registrationIncomplete: false,
      resumeRegistrationHref: '/r',
    });

    expect(props.mainAuthorisedFirm.registeredName).toBe('');
    expect(props.mainAuthorisedFirm.frn).toBe('');
  });
});
