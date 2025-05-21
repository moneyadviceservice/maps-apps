import { ReactNode, useEffect } from 'react';

import Link from 'next/link';

import { useLanguage } from '@maps-react/hooks/useLanguage';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export type EmbedPageLayoutProps = {
  title?: string;
  children: ReactNode;
};

export const EmbedPageLayout = ({ title, children }: EmbedPageLayoutProps) => {
  const { z } = useTranslation();
  const locale = useLanguage();

  useEffect(() => {
    const sendResizeMessage = () => {
      const contentHeight = document.body.scrollHeight;
      window.parent.postMessage(`MASRESIZE-${contentHeight}`, '*');
    };

    const iframeResizerParentScript = document.querySelector(
      'script[src*="iframeResizer.js"]',
    );

    if (iframeResizerParentScript) {
      return;
    }

    sendResizeMessage();

    const observer = new MutationObserver(() => {
      sendResizeMessage();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div>
      <script src="/iframeResizer.contentWindow.js" async />
      {title && (
        <div className="flex-col items-center justify-start p-4 mb-3 space-y-3 bg-white sm:space-y-0">
          <div className="flex-grow text-3xl font-bold text-blue-800 md:text-4xl">
            {title}
          </div>

          <Link
            href={`https://www.moneyhelper.org.uk/${locale}`}
            className="cursor-pointer t-powered-by focus:bg-yellow-200 focus:shadow-link-focus focus-within:outline-0 active:bg-transparent active:shadow-none"
            target="_blank"
          >
            <div className="text-base text-gray-900">
              {z({ en: 'Powered by', cy: "Wedi'i bweru gan" })}
            </div>
            <div>
              <div className="flex items-center mx-auto">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  className="text-pink-800"
                >
                  <path
                    fill="currentColor"
                    d="M3 3h4v7.5c0 1.93 1.57 3.5 3.5 3.5H13v-4l7 6l-7 6v-4h-2.5C6.36 18 3 14.64 3 10.5V3Z"
                  />
                </svg>
                <div className="font-bold text-blue-800 ">
                  {z({ en: 'MoneyHelper', cy: 'HelpwrArian' })}
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}
      {children}
    </div>
  );
};
