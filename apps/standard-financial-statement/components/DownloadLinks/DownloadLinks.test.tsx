import { render, screen } from '@testing-library/react';

import { DownloadLinks } from '.';

import '@testing-library/jest-dom';

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
});
