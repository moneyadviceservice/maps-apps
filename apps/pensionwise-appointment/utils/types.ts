import { JsonRichText } from '@maps-react/vendor/utils/RenderRichText';

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
