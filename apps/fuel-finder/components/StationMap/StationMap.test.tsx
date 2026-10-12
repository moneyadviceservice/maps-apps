import type { ComponentProps, ReactNode } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { mockMapStations } from '../../utils/FuelFinder/mocks';
import {
  mockedUseRouter,
  setupUseRouter,
} from '../../utils/FuelFinder/testHelpers';
import StationMap from './StationMap';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));

// The real library needs a browser and the Maps JavaScript API. Props the
// tests assert on become data attributes; a marker is clicked through the
// button carrying its title.
jest.mock('@vis.gl/react-google-maps', () => ({
  APIProvider: ({ children }: { children?: ReactNode }) => (
    <div data-testid="api-provider">{children}</div>
  ),
  Map: ({ children }: { children?: ReactNode }) => (
    <div data-testid="map">{children}</div>
  ),
  AdvancedMarker: ({
    children,
    title,
    zIndex,
    collisionBehavior,
    onClick,
  }: {
    children?: ReactNode;
    title?: string;
    zIndex?: number;
    collisionBehavior?: string;
    onClick?: () => void;
  }) => (
    <div
      data-testid="advanced-marker"
      data-zindex={zIndex}
      data-collision={collisionBehavior}
    >
      <button type="button" onClick={onClick}>
        {title}
      </button>
      {children}
    </div>
  ),
  InfoWindow: ({
    children,
    headerContent,
    onClose,
  }: {
    children?: ReactNode;
    headerContent?: ReactNode;
    onClose?: () => void;
  }) => (
    <div data-testid="info-window">
      {headerContent}
      {children}
      <button type="button" data-testid="info-window-close" onClick={onClose}>
        Close
      </button>
    </div>
  ),
  useAdvancedMarkerRef: () => [() => undefined, null],
  CollisionBehavior: {
    REQUIRED: 'REQUIRED',
    OPTIONAL_AND_HIDES_LOWER_PRIORITY: 'OPTIONAL_AND_HIDES_LOWER_PRIORITY',
  },
}));

const SEARCH_QUERY = { language: 'en', lat: '51.5', lng: '-0.12' };

const renderMap = (props: Partial<ComponentProps<typeof StationMap>> = {}) =>
  render(
    <StationMap apiKey="test-key" stations={mockMapStations} {...props} />,
  );

const pin = (name: RegExp) => screen.getByRole('button', { name });
const detailsLink = () =>
  screen.getByRole('link', { name: 'See more details' });

describe('StationMap', () => {
  setupUseRouter({ query: SEARCH_QUERY });

  it('renders a labelled map region with the centre pin and a priced pin per station', () => {
    renderMap();

    expect(
      screen.getByRole('region', { name: 'Map of petrol stations' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Your search location' }),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId('price-pin')).toHaveLength(
      mockMapStations.length,
    );
    const [, firstStationMarker] = screen.getAllByTestId('advanced-marker');
    expect(firstStationMarker).toHaveAttribute(
      'data-collision',
      'OPTIONAL_AND_HIDES_LOWER_PRIORITY',
    );
  });

  it('names each pin after the station and its price', () => {
    renderMap();

    expect(pin(/^Shell London Bridge, 132\.9p$/)).toBeInTheDocument();
  });

  it('ranks cheaper pins above dearer ones', () => {
    renderMap();

    const [, ...stationMarkers] = screen.getAllByTestId('advanced-marker');
    const zIndexes = stationMarkers.map((m) => m.getAttribute('data-zindex'));

    // Prices are 132.9, 132.9 and 129.9: the cheapest ranks highest
    expect(zIndexes).toEqual(['2', '1', '3']);
  });

  it('falls back to a plain dot when a station has no price', () => {
    const [station] = mockMapStations;
    renderMap({ stations: [{ ...station, price: null }] });

    expect(screen.queryByTestId('price-pin')).not.toBeInTheDocument();
    expect(screen.getByTestId('dot-pin')).toBeInTheDocument();
    expect(pin(/^Shell London Bridge$/)).toBeInTheDocument();
  });

  it('opens an info window with the station details and a link to its card', () => {
    renderMap();

    fireEvent.click(pin(/Shell London Bridge/));

    const infoWindow = screen.getByTestId('info-window');
    expect(infoWindow).toHaveTextContent('Shell London Bridge');
    expect(screen.getByTestId('info-window-price')).toHaveTextContent('132.9p');
    // The translation mock returns the template untouched
    expect(infoWindow).toHaveTextContent('{d} miles away');
    expect(detailsLink()).toHaveAttribute('href', '#station-station-001');
    expect(screen.getAllByTestId('price-pin')[0]).toHaveClass('bg-blue-700');
  });

  it('omits the price and distance rows when they are unknown', () => {
    const [station] = mockMapStations;
    renderMap({ stations: [{ ...station, price: null, distance: null }] });

    fireEvent.click(pin(/Shell London Bridge/));

    expect(screen.queryByTestId('info-window-price')).not.toBeInTheDocument();
    expect(screen.getByTestId('info-window')).not.toHaveTextContent(
      'miles away',
    );
  });

  it('opens one info window at a time and lifts the open pin above the rest', () => {
    renderMap();

    fireEvent.click(pin(/Shell London Bridge/));
    fireEvent.click(pin(/BP Waterloo/));

    expect(screen.getAllByTestId('info-window')).toHaveLength(1);
    expect(screen.getByTestId('info-window')).toHaveTextContent('BP Waterloo');

    const [, , bpMarker] = screen.getAllByTestId('advanced-marker');
    expect(bpMarker).toHaveAttribute(
      'data-zindex',
      String(mockMapStations.length + 1),
    );
    expect(bpMarker).toHaveAttribute('data-collision', 'REQUIRED');
  });

  it('closes the info window from its pin and from its close button', () => {
    renderMap();

    fireEvent.click(pin(/Shell London Bridge/));
    fireEvent.click(pin(/Shell London Bridge/));
    expect(screen.queryByTestId('info-window')).not.toBeInTheDocument();

    fireEvent.click(pin(/Shell London Bridge/));
    fireEvent.click(screen.getByTestId('info-window-close'));
    expect(screen.queryByTestId('info-window')).not.toBeInTheDocument();
  });

  it('links to the page holding the card when it is not the current page', () => {
    mockedUseRouter.mockReturnValue({ query: { ...SEARCH_QUERY, p: '2' } });
    renderMap();

    fireEvent.click(pin(/Shell London Bridge/));

    expect(detailsLink()).toHaveAttribute(
      'href',
      '?language=en&lat=51.5&lng=-0.12&p=1#station-station-001',
    );
  });

  it('renders nothing without a search location', () => {
    mockedUseRouter.mockReturnValue({ query: { language: 'en' } });
    const { container } = renderMap();

    expect(container).toBeEmptyDOMElement();
  });
});
