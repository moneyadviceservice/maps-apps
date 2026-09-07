import { Group, Links } from 'types';
import {
  Document,
  Image,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

type GroupData = Record<string, { links: Links[]; score: number }>;

export type PdfReportData = {
  highRiskGroup: GroupData;
  mediumRiskGroup: GroupData;
  lowRiskGroup: GroupData;
};

export type PdfReportContent = {
  pdfTitle: string;
  description: string;
  focusOnTitle: string;
  focusOnDescription: string;
  buildOnTitle: string;
  buidlOnDescription: string;
  keepGoingTitle: string;
  keepGoingDescription: string;
};

export type PdfReportProps = {
  data: PdfReportData;
  content: PdfReportContent;
  groups: Group[];
  language?: string;
  logoSrc: string;
};

const RISK_SECTIONS = [
  {
    titleKey: 'focusOnTitle',
    descriptionKey: 'focusOnDescription',
    groupKey: 'highRiskGroup',
  },
  {
    titleKey: 'buildOnTitle',
    descriptionKey: 'buidlOnDescription',
    groupKey: 'mediumRiskGroup',
  },
  {
    titleKey: 'keepGoingTitle',
    descriptionKey: 'keepGoingDescription',
    groupKey: 'lowRiskGroup',
  },
] as const;

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 72,
    fontFamily: 'Manrope',
    fontSize: 7.5,
    color: '#000b3b',
  },

  logo: { width: 200.5, height: 130.5 },
  h1: { fontSize: 18, fontWeight: 700, color: '#0F19A0', marginBottom: 12 },
  h2: { fontSize: 12, fontWeight: 700, color: '#0F19A0', marginBottom: 12 },
  h3: {
    fontSize: 9,
    fontWeight: 700,
    color: '#000b3b',
    marginBottom: 12,
  },
  paragraph: { marginBottom: 12 },
  linkRow: { marginBottom: 12 },
  link: { color: '#C82A87', fontWeight: 700, textDecoration: 'underline' },
});

function GroupBlock({
  group,
  links,
}: Readonly<{ group: Group; links: Links[] }>) {
  return (
    <View>
      <View wrap={false}>
        <Text style={styles.h3}>{group.title.trim()}</Text>
        <Text style={styles.paragraph}>
          {group.descritionScoreOne?.trim() ?? ''}
        </Text>
      </View>
      {links.map((l) => (
        <Text key={l.link} style={styles.linkRow}>
          <Link src={l.link} style={styles.link}>
            {l.title}
          </Link>{' '}
          {l.description ?? ''}
        </Text>
      ))}
    </View>
  );
}

export function PdfReport({
  data,
  content,
  groups,
  language,
  logoSrc,
}: Readonly<PdfReportProps>) {
  return (
    <Document
      title="Money Midlife MOT Personalised Report"
      language={language}
      pdfVersion="1.7"
    >
      <Page size="A4" style={styles.page}>
        <Image src={logoSrc} style={styles.logo} />
        <Text style={styles.h1}>{content.pdfTitle}</Text>
        <Text style={styles.paragraph}>{content.description}</Text>

        {/* wrap={false} around each heading + description keeps them
            together across page breaks */}
        {RISK_SECTIONS.map(({ titleKey, descriptionKey, groupKey }) => (
          <View key={groupKey}>
            <View wrap={false}>
              <Text style={styles.h2}>{content[titleKey]}</Text>
              <Text style={styles.paragraph}>{content[descriptionKey]}</Text>
            </View>

            {Object.entries(data[groupKey]).flatMap(([groupName, { links }]) =>
              groups
                .filter((g) => g.group === groupName)
                .map((g) => (
                  <GroupBlock
                    key={`${groupKey}-${groupName}`}
                    group={g}
                    links={links}
                  />
                )),
            )}
          </View>
        ))}
      </Page>
    </Document>
  );
}
