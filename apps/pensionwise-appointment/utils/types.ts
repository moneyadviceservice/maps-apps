import { JsonRichText } from '@maps-digital/shared/ui';

export type ToDoItem = {
  id: string;
  text: JsonRichText;
};

export type ToDoCard = {
  id: string;
  title: string;
  text: JsonRichText;
  duration: string;
};
