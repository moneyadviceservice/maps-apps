import { ProviderType } from 'utils/getOrgData/getData';
import {
  DebtAdvisorLocationMap,
  GoogleMapMarkerWithInfoWindow,
} from './DebtAdvisorLocationMap';

import { fireEvent, render } from '@testing-library/react';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    z: (translations: any) => {
      if (typeof translations === 'object' && translations.en) {
        return translations.en;
      }
      return 'en';
    },
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
    distance: 1.2,
    lat: 51.5074,
    lng: -0.1278,
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
    distance: 2.8,
    lat: 51.5075,
    lng: -0.1279,
  },
];

// Mock Google Maps components
jest.mock('@vis.gl/react-google-maps', () => ({
  APIProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="api-provider">{children}</div>
  ),
  Map: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map">{children}</div>
  ),
  AdvancedMarker: ({
    children,
    onClick,
  }: {
    children?: React.ReactNode;
    onClick?: () => void;
  }) => (
    <button
      type="button"
      data-testid="advanced-marker"
      onClick={onClick}
      style={{ background: 'none', border: 'none', padding: 0 }}
    >
      {children}
    </button>
  ),
  InfoWindow: ({
    children,
    onClose,
    headerContent,
  }: {
    children: React.ReactNode;
    onClose?: () => void;
    headerContent?: React.ReactNode;
  }) => (
    <div data-testid="info-window">
      {headerContent}
      {children}
      <button data-testid="close-button" onClick={onClose}>
        Close
      </button>
    </div>
  ),
  useAdvancedMarkerRef: () => [{ current: null }, { current: null }],
}));

// Mock the DebtAdvisorLocationCard component
jest.mock('../DebtAdvisorLocationCard/DebtAdvisorLocationCard', () => ({
  DebtAdvisorLocationCard: ({ provider, number, selected }: any) => (
    <div
      data-testid={`provider-card-${provider.id}`}
      id={`provider-${number - 1}`}
    >
      <span>{provider.name}</span>
      <span data-testid="selected-indicator">
        {selected ? 'selected' : 'not-selected'}
      </span>
    </div>
  ),
}));

describe('DebtAdvisorLocationMap', () => {
  beforeEach(() => {
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = jest.fn();

    // Mock getElementById
    const mockElement = {
      scrollIntoView: jest.fn(),
    };
    globalThis.document.getElementById = jest.fn().mockReturnValue(mockElement);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders providers in main component', () => {
    const { getByText } = render(
      <DebtAdvisorLocationMap
        providers={mockProviders}
        lang="en"
        location={{
          lat: 51.5074,
          lng: -0.1278,
        }}
      />,
    );
    expect(getByText('Test Provider')).toBeInTheDocument();
  });

  it('renders empty state when no providers', () => {
    const { container } = render(
      <DebtAdvisorLocationMap
        providers={[]}
        lang="en"
        location={{
          lat: 51.5074,
          lng: -0.1278,
        }}
      />,
    );
    // With no providers, should render an empty fragment initially
    expect(container.firstChild).toBeNull();
  });

  it('renders cards without map when showChild is false (SSR)', () => {
    const { getByTestId } = render(
      <DebtAdvisorLocationMap
        providers={mockProviders}
        lang="en"
        location={{
          lat: 51.5074,
          lng: -0.1278,
        }}
      />,
    );

    // Should render cards without map initially
    expect(getByTestId('provider-card-1')).toBeInTheDocument();
  });

  it('handles marker click and shows info window', async () => {
    const { getAllByTestId, getByTestId } = render(
      <DebtAdvisorLocationMap
        providers={mockProviders}
        lang="en"
        location={{
          lat: 51.5074,
          lng: -0.1278,
        }}
      />,
    );

    // Click on the first provider marker (index 0)
    const markers = getAllByTestId('advanced-marker');
    fireEvent.click(markers[1]); // Skip the location marker, click first provider marker

    // Should show info window
    expect(getByTestId('info-window')).toBeInTheDocument();
  });

  it('handles info window close', () => {
    const { getAllByTestId, getByTestId } = render(
      <DebtAdvisorLocationMap
        providers={mockProviders}
        lang="en"
        location={{
          lat: 51.5074,
          lng: -0.1278,
        }}
      />,
    );

    // Click marker to show info window
    const markers = getAllByTestId('advanced-marker');
    fireEvent.click(markers[1]); // Click first provider marker

    // Close info window
    const closeButton = getByTestId('close-button');
    fireEvent.click(closeButton);
  });

  it('handles provider selection and scrolling', () => {
    const { getAllByTestId, getByText } = render(
      <DebtAdvisorLocationMap
        providers={mockProviders}
        lang="en"
        location={{
          lat: 51.5074,
          lng: -0.1278,
        }}
      />,
    );

    // Click marker to show info window first
    const markers = getAllByTestId('advanced-marker');
    fireEvent.click(markers[1]);

    // Click "More info" link in info window
    const moreInfoLink = getByText('More info');
    fireEvent.click(moreInfoLink);

    // Should call scrollIntoView
    expect(document.getElementById).toHaveBeenCalledWith('provider-0');
  });

  describe('GoogleMapMarkerWithInfoWindow', () => {
    it('renders marker with valid coordinates', () => {
      const provider = {
        ...mockProviders[0],
        lat: 51.5074,
        lng: -0.1278,
      };

      const { getByTestId } = render(
        <GoogleMapMarkerWithInfoWindow
          provider={provider}
          index={0}
          infoWindowShown={false}
          handleMarkerClick={jest.fn()}
          handleClose={jest.fn()}
          onSelected={jest.fn()}
          selectedIndex={null}
        />,
      );

      expect(getByTestId('advanced-marker')).toBeInTheDocument();
    });

    it('does not render marker with invalid coordinates (null lat)', () => {
      const provider = {
        ...mockProviders[0],
        lat: null as any,
        lng: -0.1278,
      };

      const { container } = render(
        <GoogleMapMarkerWithInfoWindow
          provider={provider}
          index={0}
          infoWindowShown={false}
          handleMarkerClick={jest.fn()}
          handleClose={jest.fn()}
          onSelected={jest.fn()}
          selectedIndex={null}
        />,
      );

      expect(container.firstChild).toBeNull();
    });

    it('does not render marker with invalid coordinates (null lng)', () => {
      const provider = {
        ...mockProviders[0],
        lat: 51.5074,
        lng: null as any,
      };

      const { container } = render(
        <GoogleMapMarkerWithInfoWindow
          provider={provider}
          index={0}
          infoWindowShown={false}
          handleMarkerClick={jest.fn()}
          handleClose={jest.fn()}
          onSelected={jest.fn()}
          selectedIndex={null}
        />,
      );

      expect(container.firstChild).toBeNull();
    });

    it('does not render marker with NaN coordinates', () => {
      const provider = {
        ...mockProviders[0],
        lat: Number.NaN,
        lng: -0.1278,
      };

      const { container } = render(
        <GoogleMapMarkerWithInfoWindow
          provider={provider}
          index={0}
          infoWindowShown={false}
          handleMarkerClick={jest.fn()}
          handleClose={jest.fn()}
          onSelected={jest.fn()}
          selectedIndex={null}
        />,
      );

      expect(container.firstChild).toBeNull();
    });

    it('calls handleMarkerClick when marker is clicked', () => {
      const handleMarkerClick = jest.fn();
      const provider = {
        ...mockProviders[0],
        lat: 51.5074,
        lng: -0.1278,
      };

      const { getByTestId } = render(
        <GoogleMapMarkerWithInfoWindow
          provider={provider}
          index={2}
          infoWindowShown={false}
          handleMarkerClick={handleMarkerClick}
          handleClose={jest.fn()}
          onSelected={jest.fn()}
          selectedIndex={null}
        />,
      );

      fireEvent.click(getByTestId('advanced-marker'));
      expect(handleMarkerClick).toHaveBeenCalledWith(2);
    });

    it('shows info window when infoWindowShown is true', () => {
      const provider = {
        ...mockProviders[0],
        lat: 51.5074,
        lng: -0.1278,
        distance: 2.5,
      };

      const { getByTestId, getByText } = render(
        <GoogleMapMarkerWithInfoWindow
          provider={provider}
          index={0}
          infoWindowShown={true}
          handleMarkerClick={jest.fn()}
          handleClose={jest.fn()}
          onSelected={jest.fn()}
          selectedIndex={null}
        />,
      );

      expect(getByTestId('info-window')).toBeInTheDocument();
      expect(getByText('Test Provider')).toBeInTheDocument();
      expect(
        getByText((content, element) => {
          return content.includes('2.5') && content.includes('miles away');
        }),
      ).toBeInTheDocument();
    });

    it('calls onSelected when More info link is clicked', () => {
      const onSelected = jest.fn();
      const provider = {
        ...mockProviders[0],
        lat: 51.5074,
        lng: -0.1278,
        distance: 2.5,
      };

      const { getByText } = render(
        <GoogleMapMarkerWithInfoWindow
          provider={provider}
          index={3}
          infoWindowShown={true}
          handleMarkerClick={jest.fn()}
          handleClose={jest.fn()}
          onSelected={onSelected}
          selectedIndex={null}
        />,
      );

      const moreInfoLink = getByText((content) =>
        content.includes('More info'),
      );
      fireEvent.click(moreInfoLink);
      expect(onSelected).toHaveBeenCalledWith(3);
    });

    it('calls handleClose when info window close button is clicked', () => {
      const handleClose = jest.fn();
      const provider = {
        ...mockProviders[0],
        lat: 51.5074,
        lng: -0.1278,
      };

      const { getByTestId } = render(
        <GoogleMapMarkerWithInfoWindow
          provider={provider}
          index={1}
          infoWindowShown={true}
          handleMarkerClick={jest.fn()}
          handleClose={handleClose}
          onSelected={jest.fn()}
          selectedIndex={null}
        />,
      );

      fireEvent.click(getByTestId('close-button'));
      expect(handleClose).toHaveBeenCalledWith(1);
    });

    it('renders different marker styles for selected vs unselected', () => {
      const provider = {
        ...mockProviders[0],
        lat: 51.5074,
        lng: -0.1278,
      };

      const { rerender, container } = render(
        <GoogleMapMarkerWithInfoWindow
          provider={provider}
          index={0}
          infoWindowShown={false}
          handleMarkerClick={jest.fn()}
          handleClose={jest.fn()}
          onSelected={jest.fn()}
          selectedIndex={null}
        />,
      );

      // Check unselected state
      expect(container.querySelector('svg')).toHaveAttribute('height', '42');

      // Rerender with selected state
      rerender(
        <GoogleMapMarkerWithInfoWindow
          provider={provider}
          index={0}
          infoWindowShown={false}
          handleMarkerClick={jest.fn()}
          handleClose={jest.fn()}
          onSelected={jest.fn()}
          selectedIndex={0}
        />,
      );

      // Check selected state
      expect(container.querySelector('svg')).toHaveAttribute('height', '52');
    });
  });
});
