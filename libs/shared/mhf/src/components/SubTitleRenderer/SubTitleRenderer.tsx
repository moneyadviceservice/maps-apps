import { Heading } from '@maps-digital/shared/ui';

export interface SubTitleRendererProps {
  content: string;
  testId: string;
}

export const SubTitleRenderer = ({ content, testId }: SubTitleRendererProps) =>
  content && (
    <Heading
      component="p"
      level="h4"
      className="pt-4 mb-2 font-light"
      data-testid={testId}
    >
      {content}
    </Heading>
  );
