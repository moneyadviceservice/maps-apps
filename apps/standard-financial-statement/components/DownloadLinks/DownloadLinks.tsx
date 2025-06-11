import { Download } from 'types/@adobe/page';

import { Button, H4, Icon, IconType } from '@maps-react/common/index';
import useTranslation from '@maps-react/hooks/useTranslation';

import { getFileSize } from '../../utils/getFileSize';

export const DownloadLinks = ({
  downloads,
  assetPath,
}: {
  downloads: Download[];
  assetPath: string;
}) => {
  const { z } = useTranslation();

  return (
    <div data-testid="downloads" className="mt-10">
      <H4 className="mb-6 text-blue-600" data-testid="downloads-heading">
        {downloads.length === 1 && (
          <span>{z({ en: 'Download file', cy: 'Lawrlwythwch ffeil' })}</span>
        )}
        {downloads.length > 1 && (
          <span>
            {z({ en: 'Download files ', cy: 'Lawrlwythwch ffeiliau' })}
          </span>
        )}
      </H4>
      {downloads.map((download, index) => (
        <div key={index} className="flex items-center mb-7">
          <Button
            href={`${assetPath}${download.asset._path}`}
            target="_blank"
            as="a"
            className="gap-0 px-0 mx-0 text-magenta-700 text-[18px] font-bold"
            variant="link"
            iconRight={<Icon className="ml-2" type={IconType.DOWNLOAD} />}
          >
            {download.fileName}
          </Button>
          <div className="ml-2 text-gray-500">
            <span className="uppercase">
              ({download.asset._path.split('.').pop()},
            </span>{' '}
            <span data-testid="file">{getFileSize(download.asset.size)})</span>
          </div>
        </div>
      ))}
    </div>
  );
};
