type Props = {
  testId?: string;
};

export const Divider = ({ testId = 'divider' }: Props) => (
  <hr className="my-6 h-px border-0 bg-slate-400" data-testid={testId} />
);
