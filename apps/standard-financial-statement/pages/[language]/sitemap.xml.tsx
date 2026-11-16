import { GetServerSideProps } from 'next';

import { fetchSiteMapXML } from 'utils/fetch/sitemap';

const EXTERNAL_DATA_URL = 'https://sfs.moneyadviceservice.org.uk';

function SiteMap(
  data:
    | {
        linkTo: string;
        lastModified: string | null;
      }[]
    | undefined,
) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
     ${data
       ?.map((lGroup) => {
         const rootLink = `
        <url>
          <loc>${`${EXTERNAL_DATA_URL}/en${lGroup.linkTo}`}</loc>
          <lastmod>${lGroup.lastModified}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
          <xhtml:link rel="alternate" hreflang="cy" href="${`${EXTERNAL_DATA_URL}/cy${lGroup.linkTo}`}"/>
        </url>
     `;
         return `${rootLink}`;
       })
       .join('')}
   </urlset>
 `;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemapList = await fetchSiteMapXML();
  const sitemap = SiteMap(sitemapList);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;
