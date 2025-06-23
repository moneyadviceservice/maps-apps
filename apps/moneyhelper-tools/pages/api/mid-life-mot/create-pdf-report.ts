import { NextApiRequest, NextApiResponse } from 'next';

import PDFDocument from 'pdfkit';

import PdfUtils from '../../../utils/GeneratePDF/utils';

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  try {
    const { data, content, groups, language } = request.body;
    const dataToJson = JSON.parse(data);
    const contentToJson = JSON.parse(content);
    const groupsToJson = JSON.parse(groups);

    const doc = new PDFDocument({
      pdfVersion: '1.7',
      lang: language,
      tagged: true,
      displayTitle: true,
      size: 'A4',
      margins: {
        top: 30,
        bottom: 30,
        left: 72,
        right: 72,
      },
    });

    doc.info['Title'] = 'Money Midlife MOT Personalised Report';

    const struct = doc.struct('Document');
    doc.addStructure(struct);
    doc.registerFont('Manrope', 'public/Manrope-Regular.ttf');
    doc.registerFont('Manrope Bold', 'public/Manrope-Bold.ttf');

    doc.font('Manrope');

    doc.fillColor('#000b3b');
    //Add logo

    const documentStructure = PdfUtils(doc, struct);
    documentStructure.addLogo({
      path: 'public/MH_logo.png',
      altText: 'MoneyHelper Logo',
    });
    doc.moveDown(8);
    //Add title

    documentStructure.addHeading({
      type: 'H1',
      title: contentToJson.pdfTitle,
      boldFont: 'Manrope Bold',
      bottomMargin: 12,
    });
    doc.font('Manrope');
    // Add description
    documentStructure.addText({
      text: contentToJson.description,
      bottomMargin: 12,
    });

    //What to focus on

    documentStructure.addHeading({
      type: 'H2',
      title: contentToJson.focusOnTitle,
      boldFont: 'Manrope Bold',
    });
    doc.font('Manrope');
    documentStructure.addText({
      text: contentToJson.focusOnDescription,
    });
    createGroupContent(
      dataToJson,
      documentStructure,
      doc,
      groupsToJson,
      'highRiskGroup',
    );

    //What to build on

    documentStructure.addHeading({
      type: 'H2',
      title: contentToJson.buildOnTitle,
      boldFont: 'Manrope Bold',
    });
    doc.font('Manrope');
    documentStructure.addText({
      text: contentToJson.buidlOnDescription,
    });

    createGroupContent(
      dataToJson,
      documentStructure,
      doc,
      groupsToJson,
      'mediumRiskGroup',
    );

    //What to keep doing

    documentStructure.addHeading({
      type: 'H2',
      title: contentToJson.keepGoingTitle,
      boldFont: 'Manrope Bold',
    });
    doc.font('Manrope');
    documentStructure.addText({
      text: contentToJson.keepGoingDescription,
    });
    createGroupContent(
      dataToJson,
      documentStructure,
      doc,
      groupsToJson,
      'lowRiskGroup',
    );
    struct.end();
    doc.endMarkedContent();
    doc.end();

    const filename =
      language === 'en' ? 'Money Midlife MOT' : 'MOT Canol Oes Arian';

    return response
      .status(200)
      .setHeader('Content-Type', 'application/pdf')
      .setHeader(
        'Content-Disposition',
        'attachment; filename=' + filename + '.pdf',
      )
      .send(doc);
  } catch (er: any) {
    return;
  }
}

const createGroupContent = (
  data: any,
  structure: any,
  doc: PDFKit.PDFDocument,
  groups: any,
  groupType: string,
) => {
  Object.keys(data[groupType]).forEach((info: any) => {
    const links = data[groupType][info].links;

    const y = groups.filter((o: any) => {
      return info === o['group'];
    });

    y.forEach((el: any) => {
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

      links.forEach((l: any, i: number) => {
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
