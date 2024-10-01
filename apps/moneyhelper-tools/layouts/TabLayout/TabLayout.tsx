import React, { ReactNode, useRef } from 'react';
import {
  TabHead,
  TabContainer,
  TabBody,
  TabLink,
} from '../../components/TabLinks';
import { BackLink } from '../../components/BackLink';
import { FormData } from 'data/types';

export type Props = {
  tabLinks: string[];
  currentTab: number;
  tabContent: ReactNode;
  toolBaseUrl: string;
  formData?: FormData;
  backLink?: { href: string; title: string };
  tabHeadings?: string[];
  hasErrors?: boolean;
  buttonFormId?: string;
};

export const TabLayout = ({
  tabLinks,
  currentTab,
  tabContent,
  toolBaseUrl,
  backLink,
  tabHeadings,
  hasErrors,
  buttonFormId,
  formData,
}: Props) => {
  const activeTabRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const tabIndex = currentTab - 1;

  return (
    <TabContainer>
      {backLink && (
        <div className="mb-8 -mt-4">
          <BackLink href={backLink.href}>{backLink.title}</BackLink>
        </div>
      )}
      {tabLinks.length ? (
        <TabHead ref={activeTabRef}>
          {tabLinks.map((tabLink: string, index: number) => (
            <TabLink
              hrefPathname={`${toolBaseUrl}${index + 1}`}
              key={tabLink}
              selected={index === tabIndex}
              hasErrors={hasErrors}
              tab={index + 1}
              buttonFormId={buttonFormId}
              ref={activeTabRef}
              formData={formData}
            >
              {tabLink}
            </TabLink>
          ))}
        </TabHead>
      ) : null}
      <TabBody heading={tabHeadings?.[tabIndex]}>{tabContent}</TabBody>
    </TabContainer>
  );
};
