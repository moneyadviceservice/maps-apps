import React, { ReactNode, forwardRef, ForwardedRef, LegacyRef } from 'react';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import { addEmbedQuery } from '../../utils/addEmbedQuery';
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
};

const linkClasses = {
  default:
    't-step-navigation__button t-button py-4 snap-start leading-4 flex-none font-bold tool-nav-tab !text-pink-800 !gap-0 underline',
  focus: 'focus:bg-yellow-200 focus:border-purple-700 focus:outline-none',
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
    const activeLinkRef = ref as LegacyRef<HTMLAnchorElement>;

    const formDataQuery = { ...query };
    delete formDataQuery.tab;
    delete formDataQuery.language;

    const commonProps = {
      className: mergedClasses,
      role: 'tab' as const,
      'aria-selected': isSelected,
      'aria-disabled': hasErrors,
      tabIndex: hasErrors ? -1 : undefined,
    };

    return (
      <>
        {buttonFormId || urlPath ? (
          <Button
            ref={isSelected ? activeLinkRef : undefined}
            variant="link"
            type="submit"
            form={buttonFormId}
            name="userTab"
            value={tab}
            {...commonProps}
          >
            {children}
          </Button>
        ) : (
          <Link
            ref={isSelected ? activeLinkRef : undefined}
            href={{ pathname: hrefPathname, query: formDataQuery }}
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
