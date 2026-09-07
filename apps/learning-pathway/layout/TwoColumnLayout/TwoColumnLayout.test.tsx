import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { mockSideNavigation } from '@maps-react/mps/components/SideNavigation/sideNavigationMocks';

import { KeyInfoProps } from 'components/KeyInfo/KeyInfo';

import TwoColumnLayout from './TwoColumnLayout';

jest.mock('@maps-react/mps/components/SideNavigation', () => ({
  SideNavigation: () => <div data-testid="side-navigation" />,
}));

jest.mock('components/KeyInfo/KeyInfo', () => ({
  __esModule: true,
  default: () => <div data-testid="key-info" />,
}));

const keyInfoProps: KeyInfoProps = {
  title: 'Key information',
  tags: [],
  owner: 'MoneyHelper',
  dateAccredited: '2024-01-15T00:00:00.000Z',
  dateLaunched: '2024-02-20T00:00:00.000Z',
  preRequisite: 'None',
  furtherInfo: [],
  ownerTitle: 'Owner',
  accreditedDateTitle: 'Date Accredited',
  launchedDateTitle: 'Date Launched',
  furtherInfoTitle: 'Further information',
  preRequisiteTitle: 'Pre-requisite',
};

describe('TwoColumnLayout', () => {
  it('renders children', () => {
    render(
      <TwoColumnLayout language="en" sideNavigation={mockSideNavigation}>
        <p>Page content</p>
      </TwoColumnLayout>,
    );

    expect(screen.getByText('Page content')).toBeInTheDocument();
  });

  it('renders the SideNavigation', () => {
    render(
      <TwoColumnLayout language="en" sideNavigation={mockSideNavigation}>
        <p>Content</p>
      </TwoColumnLayout>,
    );

    expect(screen.getByTestId('side-navigation')).toBeInTheDocument();
  });

  it('renders KeyInfo when keyInfo prop is provided', () => {
    render(
      <TwoColumnLayout
        language="en"
        sideNavigation={mockSideNavigation}
        keyInfo={keyInfoProps}
      >
        <p>Content</p>
      </TwoColumnLayout>,
    );

    expect(screen.getByTestId('key-info')).toBeInTheDocument();
  });

  it('does not render KeyInfo when keyInfo prop is omitted', () => {
    render(
      <TwoColumnLayout language="en" sideNavigation={mockSideNavigation}>
        <p>Content</p>
      </TwoColumnLayout>,
    );

    expect(screen.queryByTestId('key-info')).not.toBeInTheDocument();
  });

  it('renders with null sideNavigation', () => {
    render(
      <TwoColumnLayout language="en" sideNavigation={null}>
        <p>Content</p>
      </TwoColumnLayout>,
    );

    expect(screen.getByTestId('side-navigation')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
