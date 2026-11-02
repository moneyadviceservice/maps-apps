import { PensionType } from '../../constants';
import { getPensionTypeClasses } from './getPensionTypeColors';

describe('PensionTypeClasses', () => {
  it.each`
    type               | border                  | bgDark              | bgLight               | text                  | fill                  | stroke                  | potText
    ${PensionType.AVC} | ${'border-magenta-850'} | ${'bg-magenta-850'} | ${'bg-pink-300/40'}   | ${'text-magenta-850'} | ${'fill-magenta-850'} | ${'stroke-magenta-850'} | ${'text-magenta-850'}
    ${PensionType.DB}  | ${'border-purple-650'}  | ${'bg-purple-650'}  | ${'bg-purple-100'}    | ${'text-purple-650'}  | ${'fill-purple-650'}  | ${'stroke-purple-650'}  | ${'text-purple-650'}
    ${PensionType.DC}  | ${'border-teal-700'}    | ${'bg-teal-700'}    | ${'bg-teal-100'}      | ${'text-teal-700'}    | ${'fill-teal-700'}    | ${'stroke-teal-700'}    | ${'text-teal-700'}
    ${PensionType.HYB} | ${'border-olive-500'}   | ${'bg-olive-500'}   | ${'bg-yellow-300/65'} | ${'text-olive-800'}   | ${'fill-olive-500'}   | ${'stroke-olive-500'}   | ${'text-olive-500'}
    ${PensionType.CDC} | ${'border-amber-800'}   | ${'bg-amber-800'}   | ${'bg-yellow-150'}    | ${'text-amber-850'}   | ${'fill-amber-800'}   | ${'stroke-amber-800'}   | ${'text-amber-850'}
    ${PensionType.CB}  | ${'border-gray-600'}    | ${'bg-gray-600'}    | ${'bg-tan-500/40'}    | ${'text-gray-600'}    | ${'fill-gray-600'}    | ${'stroke-gray-600'}    | ${'text-gray-600'}
    ${PensionType.VAR} | ${'border-purple-900'}  | ${'bg-purple-900'}  | ${'bg-peach-500/40'}  | ${'text-purple-900'}  | ${'fill-purple-900'}  | ${'stroke-purple-900'}  | ${'text-purple-900'}
    ${PensionType.SP}  | ${'border-blue-700'}    | ${'bg-blue-700'}    | ${undefined}          | ${undefined}          | ${undefined}          | ${undefined}            | ${undefined}
    ${undefined}       | ${'border-gray-300'}    | ${'bg-slate-200'}   | ${'bg-slate-200'}     | ${'text-blue-900'}    | ${undefined}          | ${undefined}            | ${'text-blue-900'}
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
      potText,
    }: {
      type: PensionType | undefined;
      border: string;
      bgDark: string;
      bgLight?: string;
      text?: string;
      fill?: string;
      stroke?: string;
      potText?: string;
    }) => {
      const result = getPensionTypeClasses(type);
      expect(result.borderClass).toBe(border);
      expect(result.bgDarkClass).toBe(bgDark);
      expect(result.bgLightClass).toBe(bgLight);
      expect(result.textClass).toBe(text);
      expect(result.fillClass).toBe(fill);
      expect(result.strokeClass).toBe(stroke);
      expect(result.potTextClass).toBe(potText);
    },
  );
});
