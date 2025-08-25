import { NextApiRequest, NextApiResponse } from 'next';

import path from 'path';
import PDFDocument from 'pdfkit';

import PdfUtils from '../../utils/GeneratePDF/utils';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data, content, groups, language } = req.body;

    const dataToJson = JSON.parse(data);
    const contentToJson = JSON.parse(content);
    const groupsToJson = JSON.parse(groups);

    const doc = new PDFDocument({
      pdfVersion: '1.7',
      lang: language,
      tagged: true,
      displayTitle: true,
      size: 'A4',
      margins: { top: 30, bottom: 30, left: 72, right: 72 },
    });

    // Set PDF metadata
    doc.info['Title'] = 'Money Midlife MOT Personalised Report';

    const struct = doc.struct('Document');
    doc.addStructure(struct);

    // Register fonts
    const fontPath = path.join(process.cwd(), 'public');
    doc.registerFont('Manrope', path.join(fontPath, 'Manrope-Regular.ttf'));
    doc.registerFont('Manrope Bold', path.join(fontPath, 'Manrope-Bold.ttf'));

    doc.font('Manrope');
    doc.fillColor('#000b3b');

    // Setup document structure helper
    const documentStructure = PdfUtils(doc, struct);

    // Add content to PDF
    documentStructure.addLogo({
      path: path.join(process.cwd(), 'public', 'MH_logo.png'),
      altText: 'MoneyHelper Logo',
    });
    doc.moveDown(8);

    documentStructure.addHeading({
      type: 'H1',
      title: contentToJson.pdfTitle,
      boldFont: 'Manrope Bold',
      bottomMargin: 12,
    });

    doc.font('Manrope');
    documentStructure.addText({
      text: contentToJson.description,
      bottomMargin: 12,
    });

    // Sections with group content
    documentStructure.addHeading({
      type: 'H2',
      title: contentToJson.focusOnTitle,
      boldFont: 'Manrope Bold',
    });
    doc.font('Manrope');
    documentStructure.addText({ text: contentToJson.focusOnDescription });
    createGroupContent(
      dataToJson,
      documentStructure,
      doc,
      groupsToJson,
      'highRiskGroup',
    );

    documentStructure.addHeading({
      type: 'H2',
      title: contentToJson.buildOnTitle,
      boldFont: 'Manrope Bold',
    });
    doc.font('Manrope');
    documentStructure.addText({ text: contentToJson.buidlOnDescription });
    createGroupContent(
      dataToJson,
      documentStructure,
      doc,
      groupsToJson,
      'mediumRiskGroup',
    );

    documentStructure.addHeading({
      type: 'H2',
      title: contentToJson.keepGoingTitle,
      boldFont: 'Manrope Bold',
    });
    doc.font('Manrope');
    documentStructure.addText({ text: contentToJson.keepGoingDescription });
    createGroupContent(
      dataToJson,
      documentStructure,
      doc,
      groupsToJson,
      'lowRiskGroup',
    );

    // Set filename depending on language
    const filename =
      language === 'en' ? 'Money Midlife MOT' : 'MOT Canol Oes Arian';

    // Set HTTP headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${filename}.pdf"`,
    );

    // Pipe the PDF document to the response
    doc.pipe(res);

    // Finalize PDF file
    doc.end();

    // No need to call res.end(), piping handles that automatically
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF report');
  }
}

const createGroupContent = (
  data: any,
  structure: any,
  doc: PDFKit.PDFDocument,
  groups: any,
  groupType: string,
) => {
  Object.keys(data[groupType]).forEach((info) => {
    const links = data[groupType][info].links;

    const matchingGroups = groups.filter((o: any) => info === o.group);

    matchingGroups.forEach((el: any) => {
      structure.addHeading({
        type: 'H3',
        title: el.title.trim(),
        boldFont: 'Manrope Bold',
        yPosition: doc.y + 24,
      });
      doc.font('Manrope');
      structure.addText({
        text: el.descritionScoreOne.trim(),
        bottomMargin: 12,
      });

      links.forEach((l: any) => {
        const linkY = doc.y;
        structure.addLink({
          text: l.title,
          link: l.link,
          bottomMargin: 6,
          continued: true,
          font: 'Manrope Bold',
        });

        structure.addText({
          text: l.description,
          xPosition: doc.x + 2,
          yPosition: linkY,
          underline: false,
          font: 'Manrope',
        });
      });
    });
  });
};
