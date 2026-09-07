import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import { DownloadLinks } from '.';

import '@testing-library/jest-dom';

// Mock useAnalytics hook
const mockAddEvent = jest.fn();
jest.mock('@maps-react/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    addEvent: mockAddEvent,
  }),
}));

const mockWindowOpen = jest.fn();
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  writable: true,
});

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

const mockDownload = {
  fileName: 'Download the SFS Code of Conduct',
  asset: {
    size: 83064,
    _path:
      '/content/dam/sfs/assets/sfs-code-of-conduct/MAS0126_SFS_Code_of_Conduct_A_v1.pdf',
    type: 'document',
  },
};

describe('DownloadLinks component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('renders single download correctly', () => {
    render(<DownloadLinks assetPath="test" downloads={[mockDownload]} />);
    const downloads = screen.getByTestId('downloads');
    const fileSize = screen.getByTestId('file');
    const heading = screen.getByTestId('downloads-heading');
    expect(heading).toHaveTextContent('Download file');
    expect(downloads).toMatchSnapshot();
    expect(fileSize).toHaveTextContent('81 KB');
  });

  it('renders multiple downloads correctly', () => {
    render(
      <DownloadLinks
        assetPath="test"
        downloads={[mockDownload, mockDownload]}
      />,
    );
    const downloads = screen.getByTestId('downloads');
    const heading = screen.getByTestId('downloads-heading');
    expect(heading).toHaveTextContent('Download files');
    expect(downloads).toMatchSnapshot();
  });

  describe('Download analytics', () => {
    it('triggers analytics event when download link is clicked', () => {
      render(<DownloadLinks assetPath="test" downloads={[mockDownload]} />);

      // Find and click the download link
      const downloadLink = screen.getByText('Download the SFS Code of Conduct');
      fireEvent.click(downloadLink);

      // Verify analytics event was triggered with correct payload
      expect(mockAddEvent).toHaveBeenCalledWith({
        event: 'fileDownload',
        eventInfo: {
          linkText: 'Download the SFS Code of Conduct',
        },
      });

      // Verify window.open was called with correct URL
      expect(mockWindowOpen).toHaveBeenCalledWith(
        'http://localhost/test/content/dam/sfs/assets/sfs-code-of-conduct/MAS0126_SFS_Code_of_Conduct_A_v1.pdf',
        '_blank',
      );
    });

    it('prevents default behavior when download link is clicked', () => {
      render(<DownloadLinks assetPath="test" downloads={[mockDownload]} />);

      const downloadLink = screen.getByText('Download the SFS Code of Conduct');
      const mockEvent = {
        preventDefault: jest.fn(),
        currentTarget: {
          textContent: 'Download the SFS Code of Conduct',
          href: 'http://localhost/test/content/dam/sfs/assets/sfs-code-of-conduct/MAS0126_SFS_Code_of_Conduct_A_v1.pdf',
        },
      };

      // Simulate the click event with our mock
      const clickEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'preventDefault', {
        value: mockEvent.preventDefault,
      });
      Object.defineProperty(clickEvent, 'currentTarget', {
        value: mockEvent.currentTarget,
      });

      downloadLink.dispatchEvent(clickEvent);

      // Verify preventDefault was called
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('handles download with different file types correctly', () => {
      const docxDownload = {
        fileName: 'Test Document',
        asset: {
          size: 1024,
          _path: '/content/dam/sfs/assets/test-document.docx',
          type: 'document',
        },
      };

      render(<DownloadLinks assetPath="test" downloads={[docxDownload]} />);

      const downloadLink = screen.getByText('Test Document');
      fireEvent.click(downloadLink);

      // Verify analytics event was triggered with correct file type
      expect(mockAddEvent).toHaveBeenCalledWith({
        event: 'fileDownload',
        eventInfo: {
          linkText: 'Test Document',
        },
      });

      // Verify window.open was called with correct URL
      expect(mockWindowOpen).toHaveBeenCalledWith(
        'http://localhost/test/content/dam/sfs/assets/test-document.docx',
        '_blank',
      );
    });
  });
});
