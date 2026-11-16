import { fireEvent, render, screen } from '@testing-library/react';

import { SearchAreaControl } from './SearchAreaControl';
import { ControlPosition } from '@vis.gl/react-google-maps';
import { ReactNode } from 'react';

const mockUseMap = jest.fn((): any => ({
  setCenter: jest.fn(),
  setZoom: jest.fn(),
  getCenter: jest.fn(() => {
    return { lat: jest.fn(), lng: jest.fn() };
  }),
  getZoom: jest.fn(),
}));

jest.mock('@vis.gl/react-google-maps', () => {
  return {
    APIProvider: ({ children }: { children?: ReactNode }) => (
      <div data-testid="api-provider">{children}</div>
    ),
    Map: ({ children }: { children?: ReactNode }) => (
      <div data-testid="map">{children}</div>
    ),
    MapControl: ({
      children,
      position,
    }: {
      children?: ReactNode;
      position: ControlPosition;
    }) => <div data-testid={`map-control-${position}`}>{children}</div>,
    ControlPosition: {
      BOTTOM_CENTER: 'BOTTOM_CENTER',
    },
    get useMap() {
      return mockUseMap;
    },
  };
});

describe('StationMap', () => {
  afterEach(() => {
    mockUseMap.mockReset();

    mockUseMap.mockImplementation(() => ({
      setCenter: jest.fn(),
      setZoom: jest.fn(),
      getCenter: jest.fn(() => ({ lat: jest.fn(), lng: jest.fn() })),
      getZoom: jest.fn(),
    }));
  });

  it('renders the control', async () => {
    render(<SearchAreaControl onSearchNewArea={() => {}} />);

    expect(await screen.findByText('Search this area')).toBeInTheDocument();
  });

  it('calls the callback onclick', async () => {
    const mockOnSearchNewArea = jest.fn();

    render(<SearchAreaControl onSearchNewArea={mockOnSearchNewArea} />);

    const control = await screen.findByText('Search this area');
    fireEvent.click(control);

    expect(mockOnSearchNewArea).toHaveBeenCalledTimes(1);
  });

  it('does not call the callback if undefined', async () => {
    const mockGetCenter = jest.fn();
    const mockGetZoom = jest.fn();

    mockUseMap.mockImplementation(() => ({
      setCenter: jest.fn(),
      setZoom: jest.fn(),
      getCenter: mockGetCenter,
      getZoom: mockGetZoom,
    }));

    render(<SearchAreaControl onSearchNewArea={undefined} />);

    const control = await screen.findByText('Search this area');
    fireEvent.click(control);

    expect(mockGetCenter).toHaveBeenCalledTimes(0);
    expect(mockGetZoom).toHaveBeenCalledTimes(0);
  });

  it('the onclick returns early if map is undefined', async () => {
    // @ts-ignore: undefined is unassignable type
    mockUseMap.mockImplementation(() => undefined);

    const mockOnSearchNewArea = jest.fn();

    render(<SearchAreaControl onSearchNewArea={mockOnSearchNewArea} />);

    const control = await screen.findByText('Search this area');
    fireEvent.click(control);

    expect(mockOnSearchNewArea).toHaveBeenCalledTimes(0);
  });

  test.each([
    [12, '5'],
    [11, '10'],
    [10, '25'],
    [8, '50'],
  ])(
    'given zoom %s, the onSearchNewArea callback is called with the correct value for radius (%s)',
    async (zoom, expectedRadius) => {
      mockUseMap.mockImplementation(() => ({
        setCenter: jest.fn(),
        setZoom: jest.fn(),
        getCenter: jest.fn(() => ({
          lat: jest.fn(() => 20.0),
          lng: jest.fn(() => -1.0),
        })),
        getZoom: jest.fn(() => zoom),
      }));

      const mockOnSearchNewArea = jest.fn();

      render(<SearchAreaControl onSearchNewArea={mockOnSearchNewArea} />);

      const control = await screen.findByText('Search this area');
      fireEvent.click(control);

      expect(mockOnSearchNewArea).toHaveBeenCalledWith({
        center: { lat: 20.0, lng: -1.0 },
        radius: expectedRadius,
      });
    },
  );
});
