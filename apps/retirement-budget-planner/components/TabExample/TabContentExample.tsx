import React from 'react';

import Link from 'next/link';

import { Paragraph } from '@maps-react/common/components/Paragraph';

import { TabContentExampleProps } from '../../lib/types/tabs.type';
/* This component has been created for testing reusable tab functionality. Will be removed when we start the development*/

const TabContentExample: React.FC<TabContentExampleProps> = ({
  tabIndex,
  isLastTab,
  nextTabId,
}) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md ">
      <h2 className="mb-4 text-xl font-bold text-[#0F19A0]">
        Tab {tabIndex + 1} Content
      </h2>
      <Paragraph className="mb-6 leading-relaxed text-gray-700">
        This is the content for tab {tabIndex + 1}. You can customize this
        section as needed.
      </Paragraph>
      {!isLastTab && nextTabId && (
        <Link
          href={`/?tab=${nextTabId}&last=${isLastTab}`}
          className="flex flex-wrap py-6 mx-0 mb-6 print:hidden t-step-navigation max-sm:mb-0 sm:flex max-sm:grid max-sm:grid-cols-2 max-sm:grid-rows-4 md:py-8"
        >
          Go to Next Tab
        </Link>
      )}
      {isLastTab && (
        <Paragraph className="mt-4 font-medium text-green-600">
          You reached the last tab!
        </Paragraph>
      )}
    </div>
  );
};

export default TabContentExample;
