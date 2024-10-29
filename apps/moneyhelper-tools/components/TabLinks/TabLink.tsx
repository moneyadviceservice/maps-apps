import React, {
  ReactNode,
  forwardRef,
  ForwardedRef,
  LegacyRef,
  KeyboardEvent,
} from 'react';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';
import { generateUrlParams } from '../../utils/TabToolUtils/generateUrlParams';
import { FormData } from 'data/types';
import { Button } from '@maps-react/common/components/Button';

type Props = {
  hrefPathname: string;
  tab: number;
  children: ReactNode;
  selected?: boolean;
  hasErrors?: boolean;
  buttonFormId?: string;
  formData?: FormData;
  handleKeyDown?: (
    event: KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>,
    index: number,
  ) => void;
};

const linkClasses = {
  default:
    't-step-navigation__button t-button py-4 snap-start leading-4 flex-none font-bold tool-nav-tab !text-pink-800 !gap-0 underline',
  focus:
    'focus:bg-yellow-200 focus:border-b-4 focus:border-purple-700 focus:outline-none focus:shadow-none',
};
const activeLinkClasses =
  'border-b-4 border-blue-800 !text-blue-800 !no-underline';

const concatenatedLinkClasses = Object.values(linkClasses).join(' ');

const getUrlPath = (
  hrefPathname: string,
  formData?: FormData,
  query?: { [key: string]: string | string[] | undefined },
) => {
  if (formData) {
    return `${hrefPathname}?${generateUrlParams(formData)}${addEmbedQuery(
      !!query?.isEmbedded,
      '&',
    )}`;
  }
  return undefined;
};

const isTabSelected = (
  pathname: string,
  hrefPathname: string,
  selected?: boolean,
) => {
  return pathname === hrefPathname || selected;
};

export const TabLink = forwardRef(
  (
    {
      hrefPathname,
      tab,
      children,
      selected,
      hasErrors,
      buttonFormId,
      formData,
      handleKeyDown,
    }: Props,
    ref: ForwardedRef<HTMLButtonElement | HTMLAnchorElement>,
  ) => {
    const pathname = usePathname();
    const router = useRouter();
    const { query } = router;

    const isSelected = isTabSelected(pathname, hrefPathname, selected);
    const urlPath = getUrlPath(hrefPathname, formData, query);
    const mergedClasses = twMerge(
      concatenatedLinkClasses,
      isSelected && activeLinkClasses,
      hasErrors ? 'pointer-events-none' : '',
    );

    const formDataQuery = { ...query };
    delete formDataQuery.tab;
    delete formDataQuery.language;

    const commonProps = {
      className: mergedClasses,
      role: 'tab',
      'aria-selected': isSelected,
      'aria-disabled': hasErrors,
      tabIndex: hasErrors || !isSelected ? -1 : undefined,
      'aria-controls': `tabpanel-${tab}`,
      id: `tab-${tab}`,
    };

    return (
      <>
        {buttonFormId || urlPath ? (
          <Button
            ref={ref}
            variant="link"
            type="submit"
            form={buttonFormId}
            name="userTab"
            value={tab}
            onKeyDown={(
              event: KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>,
            ) => handleKeyDown && handleKeyDown(event, tab - 1)}
            {...commonProps}
          >
            {children}
          </Button>
        ) : (
          <Link
            ref={ref as LegacyRef<HTMLAnchorElement>}
            href={{ pathname: hrefPathname, query: formDataQuery }}
            onKeyDown={(
              event: KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>,
            ) => handleKeyDown && handleKeyDown(event, tab - 1)}
            {...commonProps}
          >
            {children}
          </Link>
        )}
      </>
    );
  },
);

TabLink.displayName = 'TabLink';
