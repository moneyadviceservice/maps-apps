/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { cloneElement, isValidElement, ReactNode } from 'react';

import Image from 'next/image';

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

type NodeMapFunction = (node: Node, children: string, style?: any) => ReactNode;

type TextTextFormatFunction = (node: Node, format: Format) => ReactNode;

type ImageFormatFunction = (node: Node) => ReactNode;

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
  | 'link';

type TextFormatFunction = (value: string) => ReactNode;

type DefaultNodeMap =
  | Record<'text', TextTextFormatFunction>
  | Record<'reference', ImageFormatFunction>
  | Record<NodeMapKeys, NodeMapFunction>;

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
  paragraph: (_, children) => <Paragraph>{children}</Paragraph>,
  'unordered-list': (_, children) => (
    <ul className="pl-4 list-disc">{children}</ul>
  ),
  'ordered-list': (_, children) => <ol className="pl-4">{children}</ol>,
  'list-item': (_, children) => <li>{children}</li>,
  table: (_, children) => <table>{children}</table>,
  'table-body': (_, children) => <tbody>{children}</tbody>,
  'table-row': (_, children) => <tr>{children}</tr>,
  'table-data': (_, children) => <td>{children}</td>,
  link: (node) =>
    node.data && (
      <Link
        href={node.data.href}
        target={
          node.data['data-link-type'] === 'external'
            ? '_blank'
            : node.data.target
        }
        asInlineText
      >
        {node.value}
      </Link>
    ),
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

const addKeyToElement = (element: ReactNode, key: string | number) => {
  if (isValidElement(element) && element.key === null) {
    return cloneElement(element, { key });
  }
  return element;
};

const renderNodeList = (childNodes: Node[], options: Options) => {
  if (childNodes && options) {
    return childNodes.map((node, index: string | number) => {
      return addKeyToElement(renderNode(node, options), index);
    });
  }

  return null;
};

const renderNode = (node: Node, options: Options) => {
  const { nodeMap, textFormat, headerStyle } = options;

  if (!node || !options) {
    return null;
  }
  const children = node.content ? renderNodeList(node.content, options) : null;

  if (node.nodeType === 'header') {
    return nodeMap[node.nodeType]?.(node, children, headerStyle);
  }

  if (node.nodeType === 'text') {
    return nodeMap[node.nodeType]?.(node, textFormat);
  }
  return nodeMap[node.nodeType]?.(node, children) ?? null;
};

export const mapJsonRichText = (json: Node[]) => {
  return renderNodeList(json, {
    nodeMap: defaultNodeMap,
    textFormat: defaultTextFormat,
    headerStyle: defaultHeaderStyle,
  });
};
