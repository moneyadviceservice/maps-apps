import { render, screen } from '@testing-library/react';

import { EmergencyTaxCodeCallout } from './EmergencyTaxCodeCallout';

import '@testing-library/jest-dom';

const mockZ = jest.fn();

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({ z: mockZ }),
}));

describe('EmergencyTaxCodeCallout', () => {
  Element.prototype.scrollIntoView = jest.fn();

  beforeEach(() => {
    mockZ.mockImplementation(({ en }) => en);
  });

  it.each([undefined, false, true])(
    'shows the skip link only when enabled (%s)',
    (showSkipToContent) => {
      render(
        <EmergencyTaxCodeCallout
          taxCode="1257LW1"
          className="hidden lg:block"
          showSkipToContent={showSkipToContent}
        />,
      );

      const link = screen.queryByRole('link', { name: 'Skip to results' });
      if (showSkipToContent) {
        expect(link).toHaveAttribute('href', '#single-results-heading');
      } else {
        expect(link).not.toBeInTheDocument();
      }
    },
  );

  it('renders the guidance for an emergency tax code', () => {
    render(
      <EmergencyTaxCodeCallout taxCode="1257LW1" className="hidden lg:block" />,
    );

    expect(
      screen.getByRole('heading', {
        name: 'You are likely paying more tax than you need to',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /a refund via your new payslip or a letter issued by HMRC/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('notification-box-warning').parentElement,
    ).toHaveClass('hidden', 'lg:block');
  });

  it('renders the Welsh copy', () => {
    mockZ.mockImplementation(({ cy }) => cy);

    render(
      <EmergencyTaxCodeCallout taxCode="S1257LM1" className="lg:hidden" />,
    );

    expect(
      screen.getByRole('heading', {
        name: "Mae'n debyg eich bod chi'n talu mwy o dreth nag sydd angen",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /ad-daliad drwy eich slip cyflog newydd neu drwy lythyr gan CThEF/,
      ),
    ).toBeInTheDocument();
  });

  it('renders nothing for a standard tax code', () => {
    const { container } = render(
      <EmergencyTaxCodeCallout taxCode="1257L" className="lg:hidden" />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
