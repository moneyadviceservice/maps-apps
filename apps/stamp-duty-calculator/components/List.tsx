import { Paragraph } from '@maps-react/common/components/Paragraph';

interface ListItem {
  text: string;
}

interface ListProps {
  type: 'unordered';
  preamble: string;
  items: ListItem[];
}

export const List = ({ type, preamble, items }: ListProps) => {
  const list = {
    unordered: {
      Element: 'ul' as const,
      className:
        'list-disc list-outside space-y-4 marker:text-lg marker:leading-snug',
    },
  }[type];

  return (
    <div>
      <Paragraph className="pt-2">{preamble}</Paragraph>
      <div className="px-6">
        <list.Element className={list.className}>
          {items.map((item) => (
            <li key={item.text}>{item.text}</li>
          ))}
        </list.Element>
      </div>
    </div>
  );
};
