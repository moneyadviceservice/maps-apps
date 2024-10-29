import { ReactNode, useRef, KeyboardEvent, useEffect } from 'react';
import {
  TabHead,
  TabContainer,
  TabBody,
  TabLink,
} from '../../components/TabLinks';
import { BackLink } from '@maps-react/common/components/BackLink';
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
  tabNotice?: ReactNode;
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
  tabNotice,
}: Props) => {
  const tabIndex = currentTab - 1;
  const activeTabRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(
    null,
  );
  const tabsRef = useRef<(HTMLButtonElement | HTMLAnchorElement)[]>([]);

  useEffect(() => {
    activeTabRef.current = tabsRef.current[tabIndex];
  }, [tabIndex]);

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>,
    index: number,
  ) => {
    if (event.key === 'Tab') {
      return;
    }

    event.preventDefault();

    switch (event.key) {
      case 'ArrowLeft': {
        const focusOnTab =
          index > 0
            ? tabsRef.current[index - 1]
            : tabsRef.current[tabsRef.current.length - 1];
        focusOnTab?.focus();
        focusOnTab?.scrollIntoView({
          block: 'nearest',
          inline: 'center',
        });

        break;
      }
      case 'ArrowRight': {
        const focusOnTab =
          index < tabsRef.current.length - 1
            ? tabsRef.current[index + 1]
            : tabsRef.current[0];
        focusOnTab?.focus();
        focusOnTab?.scrollIntoView({
          block: 'nearest',
          inline: 'center',
        });

        break;
      }
      case 'Enter':
      case ' ':
        event.preventDefault();
        tabsRef.current[index]?.click();
        break;
      default:
        break;
    }
  };

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
              ref={(el) => {
                if (el) tabsRef.current[index] = el;
              }}
              formData={formData}
              handleKeyDown={handleKeyDown}
            >
              {tabLink}
            </TabLink>
          ))}
        </TabHead>
      ) : null}
      {tabNotice && <>{tabNotice}</>}
      <TabBody heading={tabHeadings?.[tabIndex]} tab={currentTab}>
        {tabContent}
      </TabBody>
    </TabContainer>
  );
};
