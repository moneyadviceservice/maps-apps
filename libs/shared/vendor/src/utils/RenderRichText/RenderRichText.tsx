/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { cloneElement, isValidElement, ReactNode } from 'react';

import Image from 'next/image';

import { Callout } from '@maps-react/common/components/Callout';
import { Divider } from '@maps-react/common/components/Divider';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';

type Data = {
  target?: string;
  href: string;
  mimetype?: string;
  path?: string;
};

type Format = {
  variants: string[];
};

export type JsonRichText = {
  json: Node[];
};

export type Node = {
  nodeType: string;
  format?: Format;
  value?: string;
  style?: string;
  data?: Data;
  content?: Node[];
};

type NodeMapFunction = (
  node: Node,
  children: string,
  style?: any,
  paragraphType?: string,
  references?: ReferenceModel,
) => ReactNode;

type TextTextFormatFunction = (node: Node, format: Format) => ReactNode;

type ReferenceFunction = (node: Node, reference: ReferenceModel) => ReactNode;

type NodeMapKeys =
  | 'header'
  | 'paragraph'
  | 'unordered-list'
  | 'ordered-list'
  | 'list-item'
  | 'table'
  | 'table-body'
  | 'table-row'
  | 'table-data'
  | 'link'
  | 'divider'
  | 'callout'
  | 'expandable-section';

type TextFormatFunction = (value: string) => ReactNode;

type DefaultNodeMap =
  | Record<'text', TextTextFormatFunction>
  | Record<'reference', ReferenceFunction>
  | Record<NodeMapKeys, NodeMapFunction>
  | Record<ShortCodeMapKeys, ReferenceFunction>;

type Options = {
  nodeMap: DefaultNodeMap;
  textFormat: Record<string, TextFormatFunction>;
  headerStyle: DefaultNodeMap;
};

const defaultNodeMap: DefaultNodeMap = {
  header: (node, children, style) => {
    if (style && node.style) {
      return style[node.style]?.(node, children);
    }
  },
  callout: (node) => {
    const { title, content, variant } = defaultTitleContentMap(node, 'default');

    return (
      <Callout variant={variant} className="px-10 pt-6 pb-6 my-6">
        {title && (
          <Heading component="h3" level="h2" className="mb-4">
            {title}
          </Heading>
        )}
        {mapJsonRichText(content)}
      </Callout>
    );
  },
  divider: () => <Divider />,
  expandable_section: (node) => {
    if (!node?.content?.length) {
      return null;
    }
    const { title, content, variant } = defaultTitleContentMap(
      node,
      'mainLeftIcon',
    );

    return (
      <ExpandableSection title={title} variant={variant}>
        {mapJsonRichText(content)}
      </ExpandableSection>
    );
  },
  paragraph: (_, children) => <Paragraph>{children}</Paragraph>,
  'unordered-list': (_, children) => (
    <ul className="pl-4 list-disc">{children}</ul>
  ),
  'ordered-list': (_, children) => <ol className="pl-4">{children}</ol>,
  'list-item': (_, children) => <li>{children}</li>,
  table: (_, children) => <table>{children}</table>,
  'table-head': (_, children) => <th>{children}</th>,
  'table-body': (_, children) => <tbody>{children}</tbody>,
  'table-row': (_, children) => <tr>{children}</tr>,
  'table-data': (_, children) => <td>{children}</td>,
  link: (node) => {
    return (
      node.data && (
        <Link
          href={node.data.href}
          className={node.data.class ?? ''}
          target={
            node.data['data-link-type'] === 'external'
              ? '_blank'
              : node.data.target
          }
          asInlineText
        >
          {node.value}
        </Link>
      )
    );
  },

  text: (node, format) => defaultRenderText(node, format),
  reference: (node) => defaultRenderImage(node),
};

const defaultTextFormat: Record<string, TextFormatFunction> = {
  bold: (value) => <strong>{value}</strong>,
  italic: (value) => <i>{value}</i>,
  underline: (value) => <u>{value}</u>,
};

const defaultHeaderStyle: Record<string, NodeMapFunction> = {
  h1: (_, children) => (
    <Heading component="h1" level="h3" className="mt-10 mb-4">
      {children}
    </Heading>
  ),
  h2: (_, children) => (
    <Heading component="h2" level="h4" className="mt-10 mb-4">
      {children}
    </Heading>
  ),
  h3: (_, children) => (
    <Heading component="h3" level="h5" className="mt-10 mb-4">
      {children}
    </Heading>
  ),
  h4: (_, children) => (
    <Heading component="h4" level="h4" className="mt-10 mb-4">
      {children}
    </Heading>
  ),
};

const defaultRenderText = (node: Node, format: Format) => {
  // @note Iterate over variants array to append formatting.
  if (node.format && node.format?.variants?.length > 0) {
    return node.format.variants.reduce((previousValue, currentValue) => {
      return format[currentValue]?.(previousValue) ?? null;
    }, node.value);
  }
  return node.value;
};

const defaultRenderImage = (node: Node) => {
  const mimeType = node.data?.mimetype;
  if (mimeType?.startsWith('image')) {
    return <Image src={process.env.AEM_HOST + node.data?.path} alt="" />;
  }
  return null;
};

const defaultTitleContentMap = (node: Node, defaultVariant: string) => {
  const data = node?.content.filter(
    (c) => c?.nodeType !== 'line-break' && !!c?.content?.length,
  );

  const variant = data
    ?.shift()
    ?.content?.[0].value.replace('VARIANT:', '')
    .replace(/\s/g, '')
    .split(',');

  const variantType = variant?.[0] ?? defaultVariant;
  const extractTitle = data?.shift()?.content?.[0];

  const title =
    extractTitle?.value && extractTitle?.format?.variants?.includes('bold')
      ? extractTitle.value
      : '';

  const items = { json: data } as JsonRichText;

  return {
    title,
    content: items.json,
    variant: variantType,
  };
};

const addKeyToElement = (element: ReactNode, key: string | number) => {
  if (isValidElement(element) && element.key === null) {
    return cloneElement(element, { key });
  }
  return element;
};

const renderNodeList = (
  childNodes: Node[],
  options: Options,
  references?: ReferenceModel,
  paragraphType?: string,
): ReactElement[] | null | undefined => {
  if (childNodes && options) {
    return childNodes.map((node, index: string | number) => {
      return addKeyToElement(
        renderNode(node, options, references, paragraphType),
        index,
      ) as ReactElement;
    });
  }

  return null;
};

const renderNode = (
  node: Node,
  options: Options,
  references?: ReferenceModel,
  paragraphType?: string,
) => {
  const { nodeMap, textFormat, headerStyle } = options;

  if (!node || !options) {
    return null;
  }
  const children = node.content
    ? renderNodeList(node.content, options, references)
    : null;

  if (node.nodeType === 'header') {
    return nodeMap[node.nodeType]?.(node, children, headerStyle);
  }

  if (node.nodeType === 'text') {
    // @ts-ignore
    return nodeMap[node.nodeType]?.(node, textFormat, references);
  }

  if (node.nodeType === 'reference') {
    // @ts-ignore
    return nodeMap[node.nodeType]?.(node, references);
  }

  return nodeMap[node.nodeType]?.(node, children, paragraphType) ?? null;
};

export enum RichTextShortcodeType {
  CALLOUT = 'CALLOUT',
  DIVIDER = 'DIVIDER',
  EXPANDABLE_SECTION = 'EXPANDABLE_SECTION',
}

// This function is used to extract shortcodes from the rich text.
// It returns an array of arrays, where each sub-array contains the start and end index of the shortcode.
//
// Example:
// - CALLOUT::  [ [5,9], [12,16] ]
const getShortcodes = (json: Node[], shortcode: string) => {
  const START = `[${shortcode}]`;
  const END = `[/${shortcode}]`;

  const codePos = (j: Node[], c: string) =>
    j
      .filter((v) => v !== null)
      .reduce((a: number[], { nodeType, content }, i) => {
        if (nodeType === 'paragraph' && content?.[0]?.value === c) {
          a.push(i);
        }
        return a;
      }, []);

  return codePos(json, START).map((n, i) => [n, codePos(json, END)[i]]);
};

// This function is a wrapper around the rich text rendering function.
// It converts a shortcode into a node type and passes the content as children.
const withShortcodes = (json: Node[]) => {
  for (const shortcode in RichTextShortcodeType) {
    const codes = getShortcodes(json, shortcode);
    if (codes.length > 0) {
      const content = codes.reduce((a: Node[], [n, o]) => {
        return [
          ...a,
          {
            nodeType: shortcode.toLowerCase(),
            content: [...json.slice(n + 1, o)],
          },
        ];
      }, []);

      codes.forEach(([start, end], index) => {
        json.forEach((_, i) => i >= start && i <= end && delete json[i]);
        json[start] = content[index];
      });
    }
  }

  return json.flat();
};

export const mapJsonRichText = (
  json: Node[],
  paragraphType?: string,
  reference?: ReferenceModel,
) => {
  return (
    !!json &&
    renderNodeList(
      withShortcodes(json),
      {
        nodeMap: defaultNodeMap,
        textFormat: defaultTextFormat,
        headerStyle: defaultHeaderStyle,
      },
      reference,
      paragraphType,
    )
  );
};
