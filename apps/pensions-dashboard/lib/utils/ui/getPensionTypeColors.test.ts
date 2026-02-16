import { PensionType } from '../../constants';
import { getPensionTypeClasses } from './getPensionTypeColors';

describe('PensionTypeClasses', () => {
  it.each`
    type               | border                  | bgDark              | bgLight               | text                  | fill                  | stroke
    ${PensionType.AVC} | ${'border-magenta-750'} | ${'bg-magenta-750'} | ${'bg-pink-300/40'}   | ${'text-magenta-750'} | ${'fill-magenta-750'} | ${'stroke-magenta-750'}
    ${PensionType.DB}  | ${'border-purple-650'}  | ${'bg-purple-650'}  | ${'bg-purple-100'}    | ${'text-purple-650'}  | ${'fill-purple-650'}  | ${'stroke-purple-650'}
    ${PensionType.DC}  | ${'border-teal-700'}    | ${'bg-teal-700'}    | ${'bg-teal-100'}      | ${'text-teal-700'}    | ${'fill-teal-700'}    | ${'stroke-teal-700'}
    ${PensionType.HYB} | ${'border-olive-500'}   | ${'bg-olive-500'}   | ${'bg-yellow-300/65'} | ${'text-olive-800'}   | ${'fill-olive-500'}   | ${'stroke-olive-500'}
    ${PensionType.SP}  | ${'border-blue-700'}    | ${'bg-blue-700'}    | ${undefined}          | ${undefined}          | ${undefined}          | ${undefined}
  `(
    'should have correct styles for $type pension type',
    ({
      type,
      border,
      bgDark,
      bgLight,
      text,
      fill,
      stroke,
    }: {
      type: PensionType;
      border: string;
      bgDark: string;
      bgLight?: string;
      text?: string;
      fill?: string;
      stroke?: string;
    }) => {
      const result = getPensionTypeClasses(type);
      expect(result.borderClass).toBe(border);
      expect(result.bgDarkClass).toBe(bgDark);
      expect(result.bgLightClass).toBe(bgLight);
      expect(result.textClass).toBe(text);
      expect(result.fillClass).toBe(fill);
      expect(result.strokeClass).toBe(stroke);
    },
  );
});
