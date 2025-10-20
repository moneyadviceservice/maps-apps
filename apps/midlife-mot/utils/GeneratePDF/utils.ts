const PdfUtils = (
  document: PDFKit.PDFDocument,
  structure: PDFKit.PDFStructureElement,
) => {
  const addLogo = ({ path, altText }: { path: string; altText: string }) => {
    const section = document.struct('Sect');
    structure.add(section);
    const figure = document.struct('Figure', { alt: altText });
    section.add(figure);

    const image = document.markStructureContent('Figure', { alt: altText });
    document.image(path, { scale: 0.25 }).stroke();

    figure.add(image);
    figure.end();
    section.end();
  };

  const ismaxY = (currentY: number) => {
    return document.page.maxY() < currentY + 31;
  };

  const addHeading = ({
    type,
    title,
    boldFont,
    x,
    y,
    bottomMargin = 12,
  }: {
    type: 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6';
    title: string;
    boldFont: PDFKit.Mixins.PDFFontSource;
    x?: number;
    y?: number;
    bottomMargin?: number;
  }) => {
    const struct = document.struct(type);
    structure.add(struct);
    const structContent = document.markStructureContent(type);
    x = x ?? document.x;
    y = y ?? document.y;

    document.font(boldFont);
    switch (type) {
      case 'H1':
        document.fill('#0F19A0').fontSize(18).text(title, x, y);
        break;
      case 'H2':
        document.fill('#0F19A0').fontSize(12).text(title, x, y);
        break;
      case 'H3':
        document.fill('#000b3b').fontSize(9).text(title, x, y);
        break;
      case 'H5':
        document.fill('#000b3b').fontSize(9).text(title, x, y);
        break;
      default:
        document.fill('#0F19A0').fontSize(18).text(title, x, y);
    }

    struct.add(structContent);

    if (bottomMargin) document.y += bottomMargin;
    struct.end();

    if (ismaxY(document.y)) {
      document.addPage();
    }
  };

  const addLink = ({
    text,
    x = document.x,
    y = document.y,
    link,
    continued,
    bottomMargin,
    font,
  }: {
    text: string;
    x: number;
    y: number;
    link: string;
    continued: boolean;
    bottomMargin: number;
    font?: PDFKit.Mixins.PDFFontSource;
  }) => {
    const struct = document.struct(String('Link'));
    structure.add(struct);
    const structContent = document.markStructureContent('Link', { alt: text });
    if (font) document.font(font);
    document
      .fill('#C82A87')
      .fontSize(7.5)

      .link(
        x,
        y,
        document.widthOfString(text),
        document.heightOfString(text),
        link,
      )
      .text(text, x, y, { continued: continued, underline: true });
    struct.add(structContent);

    if (bottomMargin) document.y += bottomMargin;

    struct.end();
  };

  const addText = ({
    text,
    bottomMargin = 12,
    xPosition = 72,
    yPosition,
    underline = false,
    font,
  }: {
    text: string;
    bottomMargin?: number;
    xPosition?: number;
    yPosition?: number;
    underline?: boolean;
    font?: PDFKit.Mixins.PDFFontSource;
  }) => {
    const struct = document.struct(String('P'));
    structure.add(struct);
    const structContent = document.markStructureContent('P');
    if (font) document.font(font);
    document
      .fontSize(7.5)
      .fill('#000b3b')
      .text(text, xPosition, yPosition, { underline: underline });

    struct.add(structContent);

    if (bottomMargin) document.y += bottomMargin;
    struct.end();

    if (ismaxY(document.y)) {
      document.addPage();
    }
  };

  const addDecorativeImage = ({
    path,
    xPosition,
    yPosition,
  }: {
    path: string;
    xPosition?: number;
    yPosition?: number;
  }) => {
    const section = document.struct('Sect');
    structure.add(section);

    const artifact = document.markStructureContent('Artifact');
    document.image(path, xPosition, yPosition).stroke();
    section.add(artifact);
    section.end();
  };

  const addHorizontalLine = ({
    color,
    marginBottom = 24,
    xPosition,
    lineX = 0,
  }: {
    color?: string;
    marginBottom?: number;
    xPosition: number;
    lineX?: number;
  }) => {
    if (ismaxY(document.y)) document.addPage();
    color = color ?? '#9da1ca';
    document
      .moveTo(xPosition, document.y)
      .lineTo(lineX, document.y)
      .fill(color)
      .stroke();

    if (marginBottom) document.y += marginBottom;
  };

  return {
    addLogo,
    addHeading,
    addLink,
    addText,
    addHorizontalLine,
    addDecorativeImage,
    ismaxY,
  };
};

export default PdfUtils;
