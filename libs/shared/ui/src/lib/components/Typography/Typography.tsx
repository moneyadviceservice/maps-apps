import TailwindTypography from '../../../../../../../tailwind-typography';

interface Font {
  [index: number]: string | { lineHeight?: string };
}

interface TypographyType {
  [key: string]: Font;
}

const fonts: TypographyType = TailwindTypography;

const fontVariants: {
  [key: string]: string;
} = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
  '7xl': 'text-7xl',
  '8xl': 'text-8xl',
  '9xl': 'text-9xl',
};

export const Typography = () => {
  return (
    <div data-testid="typography">
      {Object.entries(fonts).map(([key, value]) => {
        return (
          <div key={key} className="mb-6">
            <p className={fontVariants[key]}>
              the quick brown fox jumps over the lazy dog
            </p>
            <p>
              class <pre className="inline">'text-{key}'</pre>
            </p>
            <p>
              {typeof value[0] === 'string' && (
                <span>font-size: {value[0]}</span>
              )}
              {typeof value[1] === 'object' && value[1]?.lineHeight && (
                <p>line-height: {value[1].lineHeight}</p>
              )}
            </p>
          </div>
        );
      })}
    </div>
  );
};
