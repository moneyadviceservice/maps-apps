import TailwindColors from '../../../../../../tailwind-colors';
import { H4 } from '../../components/Heading/Heading';

// remove 'current' entry from TailwindColors
const { current: _, ...palette } = TailwindColors;

export const Colors = () => {
  return (
    <div data-testid="colors">
      {Object.entries(palette).map(([color, index]) => (
        <div key={color} className="mb-10 -ml-4 -mr-4">
          <H4 className="mb-2 ml-4 mr-4">{color}</H4>
          <div className="flex flex-wrap">
            {Object.entries(index).map(([shade, hex]) => (
              <div key={hex} className="w-1/6">
                <div className="ml-4 mr-4">
                  <div
                    className="h-32 rounded-md"
                    style={{ backgroundColor: hex }}
                    key={hex}
                  ></div>
                  <div className="mt-3">
                    <p>
                      {color}-{shade}
                    </p>
                    <p>{hex}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
