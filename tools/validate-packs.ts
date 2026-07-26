import {
  bundledPacks,
  testOnlyPacks,
} from '../content';

async function main() {
  for (const pack of [...bundledPacks, ...testOnlyPacks]) {
    console.log(
      `✓ ${pack.packId}@${pack.contentVersion}: ${pack.lessons.length} lesson(s), ${pack.entries.length} entry/entries`,
    );
  }
}

void main();
