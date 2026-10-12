import { useEffect, useState } from 'react';

type ReadMoreProps = {
  value: string;
  type?: 'comment';
};

const ReadMore = ({ value, type }: ReadMoreProps) => {
  const [show, setShow] = useState(true);

  useEffect(() => setShow(false), []);

  const truncate = (str: string, max = 30) => {
    const array = str.trim().split(' ');
    return [array.slice(0, max).join(' '), array.slice(max).join(' ')];
  };

  const [summary, truncated] = truncate(value);

  return (
    <div>
      <div className="inline">
        {type === 'comment' && '* '}
        {summary}
      </div>
      {truncated && (
        <>
          {!show && <div className="inline">...</div>}
          {show && <div className="inline">&nbsp;{truncated}</div>}
          &nbsp;
          <button
            type="button"
            className="inline text-pink-800 underline select-none"
            onClick={() => setShow((s) => !s)}
          >
            {show ? '[Read less]' : '[Read more]'}
          </button>
        </>
      )}
    </div>
  );
};

export default ReadMore;
