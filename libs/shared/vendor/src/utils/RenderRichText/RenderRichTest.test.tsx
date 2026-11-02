import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';

import { mapJsonRichText } from '.';

const mockText = 'Test content';
const mockItem1 = 'Item 1';
const mockItem2 = 'Item 2';

const ParagraphMock = {
  nodeType: 'paragraph',
  content: [
    {
      nodeType: 'text',
      value: mockText,
    },
  ],
};

const HeaderMock = {
  nodeType: 'header',
  style: 'h1',
  content: [
    {
      nodeType: 'text',
      value: mockText,
    },
  ],
};

const UnorderedListMock = {
  nodeType: 'unordered-list',
  content: [
    {
      nodeType: 'list-item',
      content: [
        {
          nodeType: 'text',
          value: mockItem1,
        },
      ],
    },
    {
      nodeType: 'list-item',
      content: [
        {
          nodeType: 'text',
          value: mockItem2,
        },
      ],
    },
  ],
};

const OrderListMock = {
  nodeType: 'ordered-list',
  content: [
    {
      nodeType: 'list-item',
      content: [
        {
          nodeType: 'text',
          value: mockItem1,
        },
      ],
    },
    {
      nodeType: 'list-item',
      content: [
        {
          nodeType: 'text',
          value: mockItem2,
        },
      ],
    },
  ],
};

describe('Render rich text', () => {
  it('handles no node correctly', () => {
    const components = mapJsonRichText([]);
    expect(components).toEqual([]);
  });
  it('renders a paragraph correctly', () => {
    const ParagraphComponent = mapJsonRichText([ParagraphMock])[0];
    expect(ParagraphComponent.type).toEqual(Paragraph);
    expect(ParagraphComponent.props.children).toEqual(['Test content']);
  });
  it('renders a heading correctly', () => {
    const HeadingComponent = mapJsonRichText([HeaderMock])[0];
    expect(HeadingComponent.type).toEqual(Heading);
    expect(HeadingComponent.props.component).toEqual('h1');
    expect(HeadingComponent.props.level).toEqual('h3');
    expect(HeadingComponent.props.children).toEqual([mockText]);
  });
  it('renders an unordered list correctly', () => {
    const ULComponent = mapJsonRichText([UnorderedListMock])[0];
    expect(ULComponent.type).toEqual('ul');
    expect(ULComponent.props.children.length).toEqual(2);

    const ListItem1 = ULComponent.props.children[0];
    expect(ListItem1.type).toEqual('li');
    expect(ListItem1.props.children).toEqual([mockItem1]);

    const ListItem2 = ULComponent.props.children[1];
    expect(ListItem2.type).toEqual('li');
    expect(ListItem2.props.children).toEqual([mockItem2]);
  });
  it('renders an ordered list correctly', () => {
    const OLComponent = mapJsonRichText([OrderListMock])[0];
    expect(OLComponent.type).toEqual('ol');

    const ListItem1 = OLComponent.props.children[0];
    expect(ListItem1.type).toEqual('li');
    expect(ListItem1.props.children).toEqual([mockItem1]);

    const ListItem2 = OLComponent.props.children[1];
    expect(ListItem2.type).toEqual('li');
    expect(ListItem2.props.children).toEqual([mockItem2]);
  });
});
