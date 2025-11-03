import type { NextApiRequest, NextApiResponse } from 'next';

import { select, spreadsheet } from 'data/budget-planner';
import Excel from 'exceljs';
import path from 'path';

const OUTPUT_FILENAME = { en: 'My Budget.xlsx', cy: 'Fy Nghyllideb.xlsx' };
const VALUE_CELL = 5; // @note Column "E"
const FACTOR_CELL = 6; // @note Column "F"

function getFactorString(selectValue: number, locale: string): string {
  const item = select.find((item) => item.value === selectValue);

  if (locale === 'cy') {
    if (!item?.welshName) return 'Mis';
    return item.welshName;
  }
  if (!item?.name) return 'Month';
  return item.name.replace('-', ' ');
}

function getTemplateFilename(locale: 'en' | 'cy') {
  return path.join(
    process.cwd(),
    'public',
    'assets',
    `BudgetTemplate_${locale}.xlsx`,
  );
}

export default async function handler(
  { body }: NextApiRequest,
  response: NextApiResponse,
) {
  const locale: 'en' | 'cy' = body.locale;
  const data = JSON.parse(body.storedData);
  const filename = getTemplateFilename(locale);
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(filename);
  spreadsheet.forEach(({ name, id, fields }) => {
    const worksheet = workbook.getWorksheet(name[locale]);
    if (!worksheet) return;
    fields?.forEach((field) => {
      if (!field) return;
      const { name, index } = field;

      if (!data[id] || !name || !data[id][name]) {
        return;
      }
      const row = worksheet.getRow(index);
      if (name.lastIndexOf('-title') > 0) {
        row.getCell(3).value = data[id][name];
      } else {
        row.getCell(VALUE_CELL).value = parseFloat(data[id][name]);
        if (data[id][`${name}-factor`]) {
          row.getCell(FACTOR_CELL).value = getFactorString(
            parseFloat(data[id][`${name}-factor`]),
            body.locale,
          );
        }
      }
      row.commit();
    });
  });
  response
    .setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
    .setHeader(
      'Content-Disposition',
      `attachment;filename=${OUTPUT_FILENAME[locale]}`,
    );
  await workbook.xlsx.write(response);
  response.end();
}
