import { ProviderType } from 'utils/getOrgData/getData';
import {
  DebtAdvisorLocationMap,
  GoogleMapMarkerWithInfoWindow,
} from './DebtAdvisorLocationMap';

import { fireEvent, getByText, render } from '@testing-library/react';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    z: () => 'en',
  }),
}));

const mockProviders: ProviderType[] = [
  {
    id: 1,
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
  },
  {
    id: 2,
    name: 'Test Provider 2',
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
  },
];

const userClickEvent = (container: HTMLElement, text: string) => {
  return fireEvent(
    getByText(container, text),
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );
};

describe('DebtAdvisorLocationMap', () => {
  it('renders providers', () => {
    const { getByText } = render(
      <DebtAdvisorLocationMap
        providers={mockProviders}
        lang="en"
        location={{
          lat: 0,
          lng: 0,
        }}
      />,
    );
    expect(getByText('Test Provider')).toBeInTheDocument();
  });

  it('renders marker with info window selected', () => {
    const markerClickMock = jest.fn();
    render(
      <GoogleMapMarkerWithInfoWindow
        provider={mockProviders[0]}
        index={1}
        infoWindowShown={true}
        handleMarkerClick={markerClickMock}
        handleClose={() => {}}
        onSelected={() => {}}
        selectedIndex={1}
      />,
    );
  });

  it('renders marker with info window', () => {
    const markerClickMock = jest.fn();
    render(
      <GoogleMapMarkerWithInfoWindow
        provider={mockProviders[0]}
        index={0}
        infoWindowShown={true}
        handleMarkerClick={markerClickMock}
        handleClose={() => {}}
        onSelected={() => {}}
        selectedIndex={null}
      />,
    );
  });
});
