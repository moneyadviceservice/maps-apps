import { render, screen } from '@testing-library/react';
import { StaticGuidance } from './StaticGuidance';
import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(() => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'results.staticGuidance.heading':
          'Guidance about your retirement options',
      };
      return translations[key] || key;
    },
  })),
}));

jest.mock('./Benefits/BenefitsSGR1', () => ({
  BenefitsSGR1: () => (
    <div data-testid="benefits-sgr1">BenefitsSGR1 Component</div>
  ),
}));

jest.mock('./Benefits/PreRetirementBenefitsSGR2', () => ({
  PreRetirementBenefitsSGR2: () => (
    <div data-testid="pre-retirement-benefits-sgr2">
      PreRetirementBenefitsSGR2 Component
    </div>
  ),
}));

jest.mock('./GenderPensionGap/GenderPensionGap', () => ({
  GenderPensionGapSGR3: () => (
    <div data-testid="gender-pension-gap-sgr3">
      GenderPensionGapSGR3 Component
    </div>
  ),
}));

jest.mock('./Scams/Scams', () => ({
  ScamsSGR6: () => <div data-testid="scams-sgr6">ScamsSGR6 Component</div>,
}));

jest.mock('./StatePensionEligibility/StatePensionEligibilitySGR7', () => ({
  StatePensionEligibilitySGR7: () => (
    <div data-testid="state-pension-eligibility-sgr7">
      StatePensionEligibilitySGR7 Component
    </div>
  ),
}));

jest.mock('./DeathBenefits/DeathBenefitsSGR4', () => ({
  DeathBenefitsSGR4: () => (
    <div data-testid="death-benefits-sgr4">DeathBenefitsSGR4 Component</div>
  ),
}));

jest.mock('./DeathBenefits/DeathBenefitsSGR5', () => ({
  DeathBenefitsSGR5: () => (
    <div data-testid="death-benefits-sgr5">DeathBenefitsSGR5 Component</div>
  ),
}));

jest.mock('@maps-react/common/components/Heading', () => ({
  Heading: ({
    children,
    level,
    variant,
  }: {
    children: React.ReactNode;
    level: string;
    variant: string;
  }) => (
    <div data-testid="heading" data-level={level} data-variant={variant}>
      {children}
    </div>
  ),
}));

describe('StaticGuidance', () => {
  const expectComponentToBeVisible = (testId: string) => {
    expect(screen.getByTestId(testId)).toBeInTheDocument();
  };

  const expectComponentNotToBeVisible = (testId: string) => {
    expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
  };

  const expectHeadingToBeRendered = () => {
    const heading = screen.getByTestId('heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Guidance about your retirement options');
  };

  describe('when user will retire in next 10 years (q-2 = 0)', () => {
    beforeEach(() => {
      render(
        <StaticGuidance
          retireInNext10Years={true}
          notRetireInNext10Years={false}
          alreadyRetired={false}
        />,
      );
    });

    it('should render StaticGuidance component when user will retire in next 10 years (q-2 = 0)', () => {
      expectHeadingToBeRendered();
      expectComponentToBeVisible('state-pension-eligibility-sgr7');
      expectComponentToBeVisible('scams-sgr6');
      expectComponentToBeVisible('death-benefits-sgr5');
      expectComponentToBeVisible('pre-retirement-benefits-sgr2');
      expectComponentToBeVisible('gender-pension-gap-sgr3');
      expectComponentNotToBeVisible('death-benefits-sgr4');
      expectComponentNotToBeVisible('benefits-sgr1');
    });
  });

  describe('when user will NOT retire in next 10 years (q-2 = 1)', () => {
    beforeEach(() => {
      render(
        <StaticGuidance
          retireInNext10Years={false}
          notRetireInNext10Years={true}
          alreadyRetired={false}
        />,
      );
    });

    it('should render StaticGuidance component when user will NOT retire in next 10 years (q-2 = 1)', () => {
      expectHeadingToBeRendered();
      expectComponentToBeVisible('state-pension-eligibility-sgr7');
      expectComponentToBeVisible('scams-sgr6');
      expectComponentToBeVisible('death-benefits-sgr4');
      expectComponentToBeVisible('benefits-sgr1');
      expectComponentToBeVisible('gender-pension-gap-sgr3');
      expectComponentNotToBeVisible('death-benefits-sgr5');
      expectComponentNotToBeVisible('pre-retirement-benefits-sgr2');
    });
  });

  describe('when user is already retired (q-2 is neither 0 nor 1)', () => {
    beforeEach(() => {
      render(
        <StaticGuidance
          retireInNext10Years={false}
          notRetireInNext10Years={false}
          alreadyRetired={true}
        />,
      );
    });

    it('should render SGR7 and already-retired guidance packages', () => {
      expectHeadingToBeRendered();
      expectComponentToBeVisible('state-pension-eligibility-sgr7');
      expectComponentToBeVisible('scams-sgr6');
      expectComponentToBeVisible('death-benefits-sgr5');
      expectComponentToBeVisible('pre-retirement-benefits-sgr2');
      expectComponentNotToBeVisible('death-benefits-sgr4');
      expectComponentNotToBeVisible('benefits-sgr1');
      expectComponentNotToBeVisible('gender-pension-gap-sgr3');
    });
  });
});
