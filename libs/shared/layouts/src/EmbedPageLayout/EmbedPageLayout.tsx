import { ReactNode } from 'react';
import Link from 'next/link';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { useLanguage } from '@maps-react/hooks/useLanguage';

export type EmbedPageLayoutProps = {
  title: string;
  children: ReactNode;
};

export const EmbedPageLayout = ({ title, children }: EmbedPageLayoutProps) => {
  const { z } = useTranslation();
  const locale = useLanguage();

  return (
    <div>
      <script src="/iframeResizer.contentWindow.js" async />
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
      {children}
    </div>
  );
};
