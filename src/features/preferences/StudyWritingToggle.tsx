import { SegmentedButtons } from 'react-native-paper';

import type { StudyWritingPreference } from '@/src/core/preferences/study-writing';

type Props = {
  value: StudyWritingPreference;
  onChange(value: StudyWritingPreference): void;
  disabled?: boolean;
};

export function StudyWritingToggle({ value, onChange, disabled }: Props) {
  return (
    <SegmentedButtons
      value={value}
      onValueChange={(nextValue) => {
        if (nextValue === 'target-first' || nextValue === 'reading-first') {
          onChange(nextValue);
        }
      }}
      buttons={[
        {
          value: 'target-first',
          label: 'Kanji',
          disabled,
          accessibilityLabel: 'Mostrar kanji como escritura principal',
        },
        {
          value: 'reading-first',
          label: 'Furigana',
          disabled,
          accessibilityLabel: 'Mostrar furigana como escritura principal',
        },
      ]}
    />
  );
}
