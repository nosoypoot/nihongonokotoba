import japaneseBasic from './japanese-basic/pack.json';
import { japaneseStudyNotesPack } from './japanese-study-notes/pack';
import yucatecMayaFixture from './yucatec-maya-fixture/pack.json';

import { parseContentPack, type ContentPack } from '@/src/core/content-schema/schema';

export const japaneseBasicPack: ContentPack = parseContentPack(japaneseBasic);
export const testOnlyPacks: ContentPack[] = [parseContentPack(yucatecMayaFixture)];
export const bundledPacks: ContentPack[] = [
  japaneseStudyNotesPack,
  japaneseBasicPack,
];
