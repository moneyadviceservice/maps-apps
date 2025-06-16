import * as pageTitles from '../../data/pageTitles';
import { FLOW, getPageTitle } from './getPageTitle';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: jest.fn((key) => key),
  }),
}));

jest.mock('../../data/pageTitles', () => ({
  defaultPageTitles: jest.fn(),
  startPageTitles: jest.fn(),
  onlinePageTitles: jest.fn(),
  telephonePageTitles: jest.fn(),
}));

describe('getPageTitle', () => {
  const step = 'someStep';
  const mockZ = jest.fn((key) => key);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the correct title for FLOW.START', () => {
    (pageTitles.startPageTitles as jest.Mock).mockImplementation((z) => ({
      [step]: 'Start Page Title',
    }));

    expect(getPageTitle(step, mockZ, FLOW.START)).toBe('Start Page Title');
    expect(pageTitles.startPageTitles).toHaveBeenCalledWith(mockZ);
  });

  it('should return the correct title for FLOW.ONLINE', () => {
    (pageTitles.onlinePageTitles as jest.Mock).mockImplementation((z) => ({
      [step]: 'Online Page Title',
    }));

    expect(getPageTitle(step, mockZ, FLOW.ONLINE)).toBe('Online Page Title');
    expect(pageTitles.onlinePageTitles).toHaveBeenCalledWith(mockZ);
  });

  it('should return the correct title for FLOW.TELEPHONE', () => {
    (pageTitles.telephonePageTitles as jest.Mock).mockImplementation((z) => ({
      [step]: 'Telephone Page Title',
    }));

    expect(getPageTitle(step, mockZ, FLOW.TELEPHONE)).toBe(
      'Telephone Page Title',
    );
    expect(pageTitles.telephonePageTitles).toHaveBeenCalledWith(mockZ);
  });

  it('should return the correct default title when flow is undefined', () => {
    (pageTitles.defaultPageTitles as jest.Mock).mockImplementation((z) => ({
      [step]: 'Default Page Title',
    }));

    expect(getPageTitle(step, mockZ)).toBe('Default Page Title');
    expect(pageTitles.defaultPageTitles).toHaveBeenCalledWith(mockZ);
  });
});
