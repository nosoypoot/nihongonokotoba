import japaneseBasic from '@/content/japanese-basic/pack.json';
import yucatecMayaFixture from '@/content/yucatec-maya-fixture/pack.json';
import { parseContentPack } from '@/src/core/content-schema/schema';

describe('content pack schema', () => {
  it('accepts the Japanese pack', () => {
    const pack = parseContentPack(japaneseBasic);
    expect(pack.entries).toHaveLength(5);
  });

  it('accepts a non-Japanese pack without structure notes', () => {
    const pack = parseContentPack(yucatecMayaFixture);
    expect(pack.languageTag).toBe('yua');
    expect(pack.entries[0].senses[0].structure).toEqual([]);
  });

  it('rejects entries pointing to a missing lesson', () => {
    const invalid = structuredClone(japaneseBasic);
    invalid.entries[0].lessonId = 'missing';
    expect(() => parseContentPack(invalid)).toThrow('Unknown lesson id');
  });

  it('rejects duplicate semantic card identities', () => {
    const invalid = structuredClone(japaneseBasic);
    invalid.entries[0].senses.push(structuredClone(invalid.entries[0].senses[0]));
    expect(() => parseContentPack(invalid)).toThrow('Duplicate card identity');
  });

  it('requires a kana reading for every Japanese example', () => {
    const invalid = structuredClone(japaneseBasic);
    const example = invalid.entries[0].senses[0].examples[0] as {
      reading?: string;
    };
    delete example.reading;
    expect(() => parseContentPack(invalid)).toThrow(
      'Japanese example requires a kana reading',
    );
  });
});
