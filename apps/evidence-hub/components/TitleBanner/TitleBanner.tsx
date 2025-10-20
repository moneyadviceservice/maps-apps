import { H1 } from '@maps-react/common/index';
import { Container } from '@maps-react/core/components/Container';

export const TitleBanner = ({ title }: { title: string }) => {
  return (
    <div className="bg-blue-700" data-testid="title-banner">
      <Container className="max-w-[1272px] py-4">
        <H1 className="text-white">{title}</H1>
      </Container>
    </div>
  );
};
