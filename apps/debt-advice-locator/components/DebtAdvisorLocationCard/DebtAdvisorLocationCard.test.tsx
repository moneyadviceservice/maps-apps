import { ProviderType } from 'utils/getOrgData/getData';

import { render } from '@testing-library/react';

import '@testing-library/jest-dom';
import { DebtAdvisorLocationCard } from './DebtAdvisorLocationCard';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    z: () => 'en',
  }),
}));

const mockProvider: ProviderType = {
  name: 'Test Provider',
  notesEN: 'Test notes in English',
  notesCY: '',
  streetAddress: '123 Test St',
  addressLocality: 'Test City',
  addressRegion: 'Test Region',
  postcode: '12345',
  providesTelephone: true,
  telephoneNumber: '123-456-7890',
  providesWeb: true,
  websiteAddress: 'https://testprovider.com',
  emailAddress: 'testprovider@test.com',
  providesFaceToFace: true,
  availableInEngland: true,
  availableInNorthernIreland: true,
  availableInScotland: true,
  availableInWales: true,
  distance: 0,
};

describe('DebtAdvisorDetailsCard', () => {
  it('renders providers', () => {
    const { getByText } = render(
      <DebtAdvisorLocationCard
        provider={mockProvider}
        lang="en"
        number={1}
        selected={false}
      />,
    );
    expect(getByText('Test Provider')).toBeInTheDocument();
  });

  it('renders provider welsh text fallback to en', () => {
    const { getByText } = render(
      <DebtAdvisorLocationCard
        provider={mockProvider}
        lang="cy"
        number={1}
        selected={false}
      />,
    );
    expect(getByText('Test Provider')).toBeInTheDocument();
  });

  it('renders provider welsh text', () => {
    const { getByText } = render(
      <DebtAdvisorLocationCard
        provider={{
          ...mockProvider,
          notesCY: 'Test notes in Welsh',
        }}
        lang="cy"
        number={1}
        selected={false}
      />,
    );
    expect(getByText('Test notes in Welsh')).toBeInTheDocument();
  });
});
