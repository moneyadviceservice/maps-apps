import { getComponent } from './getComponent';
import { CalloutVariant, Callout } from '@maps-react/common/components/Callout';
import { ColumnStrip } from '../../components/ColumnStrip';
import { ProsConsCards } from '../../components/ProsConsCards';
import { ContentCard } from '@maps-react/common/components/ContentCard';

describe('getComponent', () => {
  it('returns correct component and variant for CardGray', () => {
    const result = getComponent('CardGray');
    expect(result.Component).toBe(Callout);
    expect(result.variant).toBe(CalloutVariant.INFORMATION_MAGENTA);
  });

  it('returns correct component for Card', () => {
    const result = getComponent('Card');
    expect(result.Component).toBe(ContentCard);
    expect(result.variant).toBeUndefined();
  });

  it('returns correct component for ColumnStrip', () => {
    const result = getComponent('ColumnStrip');
    expect(result.Component).toBe(ColumnStrip);
  });

  it('returns correct component for ProsConsCards', () => {
    const result = getComponent('ProsConsCards');
    expect(result.Component).toBe(ProsConsCards);
  });

  it('throws an error for unknown componentType', () => {
    expect(() => getComponent('UnknownType')).toThrow(
      'Component type "UnknownType" is not mapped.',
    );
  });
});
