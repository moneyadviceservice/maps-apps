import ReadMore from './ReadMore';

type DetailProps = {
  title?: string;
  value: string;
};

const Detail = ({ title, value }: DetailProps) => {
  return (
    <div className="px-4 border-b border-slate-400 grid grid-cols-2 gap-x-2 py-2 leading-[23px]">
      {title && <div>{title}</div>}
      <ReadMore value={value} />
    </div>
  );
};

export default Detail;
