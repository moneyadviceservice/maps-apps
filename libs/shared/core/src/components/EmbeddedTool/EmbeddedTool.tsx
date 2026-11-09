import { twMerge } from 'tailwind-merge';

import { useLanguage } from '@maps-react/hooks/useLanguage';

export type EmbeddedToolData = {
  url: {
    en: string;
    cy: string;
  };
  api: string;
  id: string;
};

export type EmbeddedToolProps = {
  testId?: string;
  toolData: EmbeddedToolData;
  classes?: string;
};

export const EmbeddedTool = ({
  toolData,
  testId = 'iframe',
  classes,
}: EmbeddedToolProps) => {
  const lang = useLanguage();

  return (
    <div className={twMerge(classes)}>
      <script src={toolData.api}></script>
      <div
        style={{
          width: '100%',
          overflow: 'hidden',
          paddingTop: '66.66%',
          position: 'relative',
        }}
        className="mas-iframe-container"
      >
        <iframe
          style={{
            width: '100%',
            height: '100%',
            left: '0',
            position: 'absolute',
            top: '0',
            border: '0',
          }}
          className="mas-iframe"
          src={toolData.url[lang as keyof typeof toolData.url]}
          data-testid={testId}
          id={toolData.id}
          title={toolData.id}
        ></iframe>
      </div>
    </div>
  );
};
