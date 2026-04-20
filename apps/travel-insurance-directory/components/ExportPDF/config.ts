import { StyleSheet } from '@react-pdf/renderer';

const COL_NAME = '24%';
const COL_WEBSITE = '38%';
const COL_PHONE = '12%';
const COL_EMAIL = '26%';

const BRAND_BLUE = '#0F19A0';
const PAGE_MARGIN_H = 72;
const PAGE_MARGIN_TOP = 36;
const HEADER_TO_CONTENT_GAP = 16;
const HEADER_HEIGHT = 100;
const FOOTER_HEIGHT = 97;
const CONTENT_BAND_TOP = HEADER_HEIGHT + HEADER_TO_CONTENT_GAP;

/** A4 landscape height in pt (react-pdf). */
const A4_LANDSCAPE_HEIGHT_PT = 595;
/** Approximate height of the table header row (margin + padding + line). */
const APPROX_HEADER_ROW_HEIGHT_PT = 32;
/** Approximate height of one data row (paddingVertical 5×2 + line height for 8pt font). */
const APPROX_DATA_ROW_HEIGHT_PT = 20;

const contentHeightPt =
  A4_LANDSCAPE_HEIGHT_PT - CONTENT_BAND_TOP - FOOTER_HEIGHT;
const availableForRows = contentHeightPt - APPROX_HEADER_ROW_HEIGHT_PT;
/** Max data rows per page so we never overflow and create an empty follow-up page. */
export const ROWS_PER_PAGE = Math.floor(
  availableForRows / APPROX_DATA_ROW_HEIGHT_PT,
);

export const LAYOUT = {
  PAGE_MARGIN_H,
  PAGE_MARGIN_TOP,
  HEADER_HEIGHT,
  HEADER_TO_CONTENT_GAP,
  FOOTER_HEIGHT,
  CONTENT_BAND_TOP,
} as const;

export const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    padding: 0,
    paddingTop: CONTENT_BAND_TOP,
    paddingBottom: FOOTER_HEIGHT,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: -8,
    right: 0,
    height: HEADER_HEIGHT,
    paddingLeft: PAGE_MARGIN_H,
    paddingTop: PAGE_MARGIN_TOP,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: 141,
    height: 66,
    objectFit: 'contain',
  },
  contentBackground: {
    position: 'absolute',
    top: CONTENT_BAND_TOP,
    bottom: FOOTER_HEIGHT,
  },
  contentArea: {
    marginLeft: PAGE_MARGIN_H,
    marginRight: PAGE_MARGIN_H,
  },
  table: {
    width: '100%',
  },
  headerRow: {
    marginTop: 8,
    marginBottom: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingVertical: 6,
    fontWeight: 'bold',
    fontSize: 9,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    paddingVertical: 5,
    fontSize: 8,
  },
  cellName: { width: COL_NAME, paddingRight: 6 },
  cellWebsite: { width: COL_WEBSITE, paddingRight: 6 },
  cellPhone: { width: COL_PHONE, paddingRight: 6 },
  cellEmail: { width: COL_EMAIL, paddingRight: 6 },
  footer: {
    position: 'absolute',
    bottom: -16,
    left: 0,
    right: 0,
    height: FOOTER_HEIGHT,
    paddingLeft: PAGE_MARGIN_H,
    paddingRight: PAGE_MARGIN_H,
    paddingTop: 12,
    paddingBottom: 20,
    color: BRAND_BLUE,
  },
  footerText: {
    fontSize: 7,
    color: BRAND_BLUE,
    lineHeight: 1.4,
  },
  footerTextFirstLine: {
    fontSize: 9,
    fontWeight: 'bold',
    color: BRAND_BLUE,
    marginBottom: 4,
  },
  footerTextBlock: {
    lineHeight: 1.5,
  },
  decoration: {
    position: 'absolute',
    top: CONTENT_BAND_TOP,
    bottom: FOOTER_HEIGHT,
    right: -40,
    width: 140,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  decorationImage: {
    width: 140,
    height: 182,
    objectFit: 'contain',
  },
});

export const FOOTER_LINES = [
  'Borough Hall, Cauldwell Street, Bedford, MK42 9AB',
  'e: money.enquiries@moneyhelper.org.uk | pensions.enquiries@moneyhelper.org.uk | w: MoneyAndPensionsService.org.uk',
];
export const FOOTER_TITLE = 'Money and Pensions Service';
