import { useEffect, useState } from 'react';
import { useLanguage } from '@maps-digital/shared/hooks';

export type EmbeddedTool = {
  url: {
    en: string;
    cy: string;
  };
  id: string;
};

export type RubyIFrameProps = {
  testId?: string;
  toolData: EmbeddedTool;
};

export const RubyIFrame = ({
  toolData,
  testId = 'iframe',
}: RubyIFrameProps) => {
  const [iframeHeight, setIframeHeight] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  const lang = useLanguage();

  useEffect(() => {
    setHasMounted(true);
    const handler = (event: MessageEvent) => {
      if (
        typeof event.data === 'string' &&
        event.data.startsWith('MASRESIZE-')
      ) {
        const height = parseInt(event.data.substring('MASRESIZE-'.length), 10);
        setIframeHeight(height);
      }
    };
    window.addEventListener('message', handler);

    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    hasMounted && (
      <iframe
        data-testid={testId}
        id={toolData.id}
        title={toolData.id}
        height={iframeHeight}
        className="w-full"
        src={toolData.url[lang as keyof typeof toolData.url]}
      />
    )
  );
};
