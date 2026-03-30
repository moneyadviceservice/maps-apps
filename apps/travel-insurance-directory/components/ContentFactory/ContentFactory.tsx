import { PropsWithChildren } from 'react';

import { CopyItem } from 'data/pages/register/types';

import { Callout } from '@maps-react/common/components/Callout';
import { Heading } from '@maps-react/common/components/Heading';
import { ListElement } from '@maps-react/common/components/ListElement';
import { Paragraph } from '@maps-react/common/components/Paragraph';

type Props = {
  copy: CopyItem[];
} & PropsWithChildren;

export const ContentFactory = ({ copy, children }: Props) => {
  const renderItem = (item: CopyItem, index: number, parentKey = 'root') => {
    const key = `${parentKey}-${item.component}-${index}`;
    const testId = `copyItemContent-${index}`;

    switch (item.component) {
      case 'heading':
        return (
          <Heading
            key={key}
            level={item.level}
            data-testid={testId}
            className={item.style}
          >
            {item.content}
          </Heading>
        );

      case 'paragraph':
        return (
          <Paragraph
            key={key}
            className={`mb-6 text-lg ${item.style || ''}`}
            data-testid={testId}
          >
            {item.content}
          </Paragraph>
        );

      case 'span':
        return (
          <span
            key={key}
            className={`block ${item.style || ''}`}
            data-testid={testId}
          >
            {item.content}
          </span>
        );

      case 'list':
        return (
          <ListElement
            key={key}
            variant="unordered"
            color="blue"
            className="ml-4 pb-8 pl-4 pr-8 text-gray-800"
            items={item.items.map((li, i) => (
              <div key={`${key}-li-${i}`} className="flex flex-col mb-2">
                <span className={li.hintText ? 'font-semibold' : ''}>
                  {li.label}
                </span>
                {li.hintText && <span> {li.hintText}</span>}
              </div>
            ))}
          />
        );

      case 'callout':
        return (
          <Callout
            key={key}
            data-testid={testId}
            variant={item.variant}
            className={item.style}
          >
            {item.heading && (
              <Heading
                level={item.heading.level}
                component={item.heading.componentLevel}
                className={item.heading.style}
              >
                {item.heading.content}
              </Heading>
            )}
            {item.copy?.map((nestedItem, i) => renderItem(nestedItem, i, key))}
          </Callout>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {copy.map((item, index) => renderItem(item, index))}
      {children}
    </>
  );
};
