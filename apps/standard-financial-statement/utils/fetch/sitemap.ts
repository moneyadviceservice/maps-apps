import { LinkType } from 'types/@adobe/components';

import { aemHeadlessClient } from '@maps-react/utils/aemHeadlessClient';

export type SiteMapDataResponse = {
  siteMap: SiteMapData | null;
  siteMapMeta: SiteMapMetaData[];
};

export type SiteMapData = {
  sideNavigationLinks: LinkType[];
  linkGroup: {
    rootLink: {
      linkTo: string;
      text: string;
    };
    childLinksGroup: {
      title: string;
      childLinks: LinkType[];
    }[];
    childLinks: LinkType[];
  }[];
};

export type SiteMapCalendarMeta = {
  calendarMetadata: {
    name: string;
    value: string;
  }[];
};

export type SiteMapMetaData = {
  slug: string;
  _metadata: SiteMapCalendarMeta;
};

export const fetchSiteMap = async (
  lang: string,
): Promise<SiteMapDataResponse> => {
  try {
    const { data } = (await aemHeadlessClient.runPersistedQuery(
      `sfs/get-sitemap-${lang}`,
    )) as {
      data: {
        siteMapList: {
          items: SiteMapData[];
        };
        useTheSfsTemplateList: {
          items: SiteMapMetaData[];
        };
        pageTemplateList: {
          items: SiteMapMetaData[];
        };
        pageSectionTemplateList: {
          items: SiteMapMetaData[];
        };
        homepageTemplateList: {
          items: {
            _metadata: SiteMapCalendarMeta;
          }[];
        };
      };
    };

    return {
      siteMap: data.siteMapList.items[0],
      siteMapMeta: [
        ...data.useTheSfsTemplateList.items,
        ...data.pageTemplateList.items,
        ...data.pageSectionTemplateList.items,
        ...data.homepageTemplateList.items.map((item) => ({
          slug: 'home',
          _metadata: item._metadata,
        })),
      ].filter((i) => i._metadata),
    };
  } catch (error) {
    console.error('failed to get sitemap: ', error);
    return {
      siteMap: null,
      siteMapMeta: [],
    };
  }
};

export const fetchSiteMapXML = async () => {
  const sitemapJSON = await fetchSiteMap('en');

  const getMeta = (linkTo: string) => {
    const calendarMetadata = sitemapJSON.siteMapMeta.find(
      (meta) => `/${meta.slug.replace('>', '/')}` === linkTo,
    )?._metadata.calendarMetadata;
    return (
      calendarMetadata?.find((m) => m.name === 'cq:lastPublished')?.value ??
      null
    );
  };

  const homeLink = {
    linkTo: '/',
    lastModified: getMeta('/home'),
  };

  const res = sitemapJSON.siteMap?.linkGroup
    .flatMap((lGroup) => {
      const rootLink = {
        linkTo: lGroup.rootLink.linkTo,
        lastModified: getMeta(lGroup.rootLink.linkTo),
      };

      const childLinks =
        lGroup.childLinks?.map((child) => ({
          linkTo: child.linkTo,
          lastModified: getMeta(lGroup.rootLink.linkTo),
        })) || [];

      const childLinksGroup =
        lGroup.childLinksGroup?.flatMap((childGroup) =>
          childGroup.childLinks.map((child) => ({
            linkTo: child.linkTo,
            lastModified: getMeta(lGroup.rootLink.linkTo),
          })),
        ) || [];

      return [rootLink, ...childLinks, ...childLinksGroup];
    })
    .filter((link) => link.lastModified !== null);

  return [
    homeLink,
    ...(res as { linkTo: string; lastModified: string | null }[]),
  ];
};
