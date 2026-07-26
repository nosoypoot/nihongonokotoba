import {
  parseContentPack,
  type VocabularyEntry,
} from '@/src/core/content-schema/schema';

type StructurePart = VocabularyEntry['senses'][number]['structure'][number];

type EntrySeed = {
  id: string;
  lessonId: string;
  target: string;
  reading?: string;
  partOfSpeech: { es: string; en: string };
  meanings: { es: string; en: string };
  explanation: { es: string; en: string };
  example: {
    target: string;
    reading: string;
    es: string;
    en: string;
  };
  structure?: StructurePart[];
};

function makeEntry(seed: EntrySeed): VocabularyEntry {
  return {
    id: seed.id,
    lessonId: seed.lessonId,
    target: seed.target,
    reading: seed.reading,
    partOfSpeech: seed.partOfSpeech,
    senses: [
      {
        id: 'primary',
        meanings: seed.meanings,
        explanation: seed.explanation,
        structure: seed.structure ?? [],
        examples: [
          {
            id: `${seed.id}-example`,
            target: seed.example.target,
            reading: seed.example.reading,
            translations: {
              es: seed.example.es,
              en: seed.example.en,
            },
          },
        ],
      },
    ],
  };
}

const noun = { es: 'sustantivo', en: 'noun' };
const pronoun = { es: 'pronombre', en: 'pronoun' };
const expression = { es: 'expresión', en: 'expression' };

const introductions: EntrySeed[] = [
  {
    id: 'notes-watashi',
    lessonId: 'notes-lesson-01',
    target: '私',
    reading: 'わたし',
    partOfSpeech: pronoun,
    meanings: { es: 'yo', en: 'I; me' },
    explanation: {
      es: 'Es una forma neutra y cortés de hablar de uno mismo. En japonés suele omitirse cuando el contexto ya indica quién habla.',
      en: 'It is a neutral, polite way to refer to yourself. Japanese often omits it when the speaker is already clear.',
    },
    example: {
      target: '私はアルベルトです。',
      reading: 'わたしはアルベルトです。',
      es: 'Yo soy Alberto.',
      en: 'I am Alberto.',
    },
    structure: [
      {
        form: '私',
        reading: 'わたし',
        meanings: { es: 'yo; privado', en: 'I; private' },
      },
    ],
  },
  {
    id: 'notes-anata',
    lessonId: 'notes-lesson-01',
    target: 'あなた',
    partOfSpeech: pronoun,
    meanings: { es: 'usted; tú', en: 'you' },
    explanation: {
      es: 'Puede usarse cuando no se conoce el nombre, pero normalmente es más natural llamar a la persona por su nombre y さん.',
      en: 'It can be used when a name is unknown, but using the person’s name plus さん is often more natural.',
    },
    example: {
      target: 'あなたは学生ですか。',
      reading: 'あなたはがくせいですか。',
      es: '¿Usted es estudiante?',
      en: 'Are you a student?',
    },
  },
  {
    id: 'notes-ano-hito',
    lessonId: 'notes-lesson-01',
    target: 'あの人',
    reading: 'あのひと',
    partOfSpeech: noun,
    meanings: { es: 'aquella persona', en: 'that person' },
    explanation: {
      es: 'あの señala algo alejado tanto del hablante como del oyente; 人 aporta la idea de persona.',
      en: 'あの points to something away from both speaker and listener; 人 contributes the idea of a person.',
    },
    example: {
      target: 'あの人は先生です。',
      reading: 'あのひとはせんせいです。',
      es: 'Aquella persona es profesora.',
      en: 'That person is a teacher.',
    },
    structure: [
      {
        form: 'あの',
        meanings: { es: 'aquel; aquella', en: 'that over there' },
      },
      {
        form: '人',
        reading: 'ひと',
        meanings: { es: 'persona', en: 'person' },
      },
    ],
  },
  {
    id: 'notes-sensei',
    lessonId: 'notes-lesson-01',
    target: '先生',
    reading: 'せんせい',
    partOfSpeech: noun,
    meanings: { es: 'profesor; maestro', en: 'teacher; instructor' },
    explanation: {
      es: 'Es un título respetuoso para docentes y otros especialistas. No suele usarse para describir la propia profesión.',
      en: 'It is a respectful title for teachers and other specialists. It is not normally used to state your own occupation.',
    },
    example: {
      target: '田中先生は日本人です。',
      reading: 'たなかせんせいはにほんじんです。',
      es: 'El profesor Tanaka es japonés.',
      en: 'Professor Tanaka is Japanese.',
    },
    structure: [
      {
        form: '先',
        reading: 'せん',
        meanings: { es: 'antes; adelante', en: 'before; ahead' },
      },
      {
        form: '生',
        reading: 'せい',
        meanings: { es: 'vida; nacer', en: 'life; birth' },
      },
    ],
  },
  {
    id: 'notes-kyoushi',
    lessonId: 'notes-lesson-01',
    target: '教師',
    reading: 'きょうし',
    partOfSpeech: noun,
    meanings: { es: 'docente; profesor de profesión', en: 'teacher; educator' },
    explanation: {
      es: 'Nombra la profesión de enseñar, por eso puede usarse al hablar del propio trabajo.',
      en: 'It names teaching as an occupation, so it can be used when describing your own job.',
    },
    example: {
      target: '私は日本語の教師です。',
      reading: 'わたしはにほんごのきょうしです。',
      es: 'Soy profesor de japonés.',
      en: 'I am a Japanese-language teacher.',
    },
    structure: [
      {
        form: '教',
        reading: 'きょう',
        meanings: { es: 'enseñar', en: 'teach' },
      },
      {
        form: '師',
        reading: 'し',
        meanings: { es: 'especialista; maestro', en: 'expert; master' },
      },
    ],
  },
  {
    id: 'notes-gakusei',
    lessonId: 'notes-lesson-01',
    target: '学生',
    reading: 'がくせい',
    partOfSpeech: noun,
    meanings: { es: 'estudiante', en: 'student' },
    explanation: {
      es: '学 se relaciona con estudiar y 生 con la persona que vive esa condición.',
      en: '学 relates to study, while 生 points to the person living that role.',
    },
    example: {
      target: 'マリアさんは大学の学生です。',
      reading: 'マリアさんはだいがくのがくせいです。',
      es: 'María es estudiante universitaria.',
      en: 'Maria is a university student.',
    },
    structure: [
      {
        form: '学',
        reading: 'がく',
        meanings: { es: 'estudio; aprendizaje', en: 'study; learning' },
      },
      {
        form: '生',
        reading: 'せい',
        meanings: { es: 'vida; persona', en: 'life; person' },
      },
    ],
  },
  {
    id: 'notes-kaishain',
    lessonId: 'notes-lesson-01',
    target: '会社員',
    reading: 'かいしゃいん',
    partOfSpeech: noun,
    meanings: { es: 'empleado de una empresa', en: 'company employee' },
    explanation: {
      es: '会社 significa empresa y 員 indica a una persona que pertenece a una organización.',
      en: '会社 means company, and 員 marks a person who belongs to an organization.',
    },
    example: {
      target: '父は会社員です。',
      reading: 'ちちはかいしゃいんです。',
      es: 'Mi padre es empleado de una empresa.',
      en: 'My father is a company employee.',
    },
    structure: [
      {
        form: '会社',
        reading: 'かいしゃ',
        meanings: { es: 'empresa', en: 'company' },
      },
      {
        form: '員',
        reading: 'いん',
        meanings: { es: 'miembro; empleado', en: 'member; employee' },
      },
    ],
  },
  {
    id: 'notes-ginkouin',
    lessonId: 'notes-lesson-01',
    target: '銀行員',
    reading: 'ぎんこういん',
    partOfSpeech: noun,
    meanings: { es: 'empleado de banco', en: 'bank employee' },
    explanation: {
      es: 'Combina 銀行, banco, con 員, miembro o empleado de una organización.',
      en: 'It combines 銀行, bank, with 員, a member or employee of an organization.',
    },
    example: {
      target: '兄は銀行員です。',
      reading: 'あにはぎんこういんです。',
      es: 'Mi hermano mayor trabaja en un banco.',
      en: 'My older brother is a bank employee.',
    },
    structure: [
      {
        form: '銀行',
        reading: 'ぎんこう',
        meanings: { es: 'banco', en: 'bank' },
      },
      {
        form: '員',
        reading: 'いん',
        meanings: { es: 'miembro; empleado', en: 'member; employee' },
      },
    ],
  },
  {
    id: 'notes-isha',
    lessonId: 'notes-lesson-01',
    target: '医者',
    reading: 'いしゃ',
    partOfSpeech: noun,
    meanings: { es: 'médico; médica', en: 'doctor; physician' },
    explanation: {
      es: '医 se relaciona con medicina y 者 identifica a la persona que realiza una actividad.',
      en: '医 relates to medicine, while 者 identifies the person who performs an activity.',
    },
    example: {
      target: 'あの方は医者です。',
      reading: 'あのかたはいしゃです。',
      es: 'Aquella persona es médica.',
      en: 'That person is a doctor.',
    },
    structure: [
      {
        form: '医',
        reading: 'い',
        meanings: { es: 'medicina', en: 'medicine' },
      },
      {
        form: '者',
        reading: 'しゃ',
        meanings: { es: 'persona', en: 'person' },
      },
    ],
  },
  {
    id: 'notes-kenkyuusha',
    lessonId: 'notes-lesson-01',
    target: '研究者',
    reading: 'けんきゅうしゃ',
    partOfSpeech: noun,
    meanings: { es: 'investigador; investigadora', en: 'researcher' },
    explanation: {
      es: '研究 es investigación y 者 convierte la actividad en la persona que la realiza.',
      en: '研究 is research, and 者 turns the activity into the person who performs it.',
    },
    example: {
      target: '佐藤さんは大学の研究者です。',
      reading: 'さとうさんはだいがくのけんきゅうしゃです。',
      es: 'Sato es investigador de una universidad.',
      en: 'Sato is a university researcher.',
    },
    structure: [
      {
        form: '研究',
        reading: 'けんきゅう',
        meanings: { es: 'investigación', en: 'research' },
      },
      {
        form: '者',
        reading: 'しゃ',
        meanings: { es: 'persona', en: 'person' },
      },
    ],
  },
  {
    id: 'notes-daigaku',
    lessonId: 'notes-lesson-01',
    target: '大学',
    reading: 'だいがく',
    partOfSpeech: noun,
    meanings: { es: 'universidad', en: 'university' },
    explanation: {
      es: '大 aporta la idea de grande y 学 la de estudio: una institución de estudios superiores.',
      en: '大 contributes the idea of large, and 学 the idea of study: an institution of higher learning.',
    },
    example: {
      target: '大学は京都にあります。',
      reading: 'だいがくはきょうとにあります。',
      es: 'La universidad está en Kioto.',
      en: 'The university is in Kyoto.',
    },
    structure: [
      {
        form: '大',
        reading: 'だい',
        meanings: { es: 'grande', en: 'large' },
      },
      {
        form: '学',
        reading: 'がく',
        meanings: { es: 'estudio', en: 'study' },
      },
    ],
  },
  {
    id: 'notes-byouin',
    lessonId: 'notes-lesson-01',
    target: '病院',
    reading: 'びょういん',
    partOfSpeech: noun,
    meanings: { es: 'hospital', en: 'hospital' },
    explanation: {
      es: '病 expresa enfermedad e 院 aparece en nombres de instituciones.',
      en: '病 expresses illness, and 院 appears in names of institutions.',
    },
    example: {
      target: '母は病院で働きます。',
      reading: 'はははびょういんではたらきます。',
      es: 'Mi madre trabaja en un hospital.',
      en: 'My mother works at a hospital.',
    },
    structure: [
      {
        form: '病',
        reading: 'びょう',
        meanings: { es: 'enfermedad', en: 'illness' },
      },
      {
        form: '院',
        reading: 'いん',
        meanings: { es: 'institución', en: 'institution' },
      },
    ],
  },
  {
    id: 'notes-dare',
    lessonId: 'notes-lesson-01',
    target: '誰',
    reading: 'だれ',
    partOfSpeech: pronoun,
    meanings: { es: 'quién', en: 'who' },
    explanation: {
      es: 'Pregunta por la identidad de una persona. どなた comunica la misma idea con mayor cortesía.',
      en: 'It asks for a person’s identity. どなた communicates the same idea more politely.',
    },
    example: {
      target: 'あの人は誰ですか。',
      reading: 'あのひとはだれですか。',
      es: '¿Quién es aquella persona?',
      en: 'Who is that person?',
    },
  },
  {
    id: 'notes-nansai',
    lessonId: 'notes-lesson-01',
    target: '何歳',
    reading: 'なんさい',
    partOfSpeech: expression,
    meanings: { es: 'cuántos años de edad', en: 'how old' },
    explanation: {
      es: '何 pregunta “qué/cuánto” y 歳 es el contador de años de edad. おいくつ es una alternativa más cortés.',
      en: '何 asks “what/how many,” and 歳 counts years of age. おいくつ is a more polite alternative.',
    },
    example: {
      target: '妹は何歳ですか。',
      reading: 'いもうとはなんさいですか。',
      es: '¿Cuántos años tiene tu hermana menor?',
      en: 'How old is your younger sister?',
    },
    structure: [
      {
        form: '何',
        reading: 'なん',
        meanings: { es: 'qué; cuántos', en: 'what; how many' },
      },
      {
        form: '歳',
        reading: 'さい',
        meanings: { es: 'años de edad', en: 'years of age' },
      },
    ],
  },
  {
    id: 'notes-hajimemashite',
    lessonId: 'notes-lesson-01',
    target: '初めまして',
    reading: 'はじめまして',
    partOfSpeech: expression,
    meanings: { es: 'mucho gusto', en: 'nice to meet you' },
    explanation: {
      es: 'Se usa al iniciar una primera presentación. 初 remite a lo primero o al comienzo.',
      en: 'It opens a first-time introduction. 初 points to something first or beginning.',
    },
    example: {
      target: '初めまして。ルイスです。',
      reading: 'はじめまして。ルイスです。',
      es: 'Mucho gusto. Soy Luis.',
      en: 'Nice to meet you. I’m Luis.',
    },
    structure: [
      {
        form: '初',
        reading: 'はじ',
        meanings: { es: 'primero; comienzo', en: 'first; beginning' },
      },
    ],
  },
  {
    id: 'notes-yoroshiku',
    lessonId: 'notes-lesson-01',
    target: 'よろしくお願いします',
    reading: 'よろしくおねがいします',
    partOfSpeech: expression,
    meanings: {
      es: 'mucho gusto; cuento con usted',
      en: 'pleased to meet you; please treat me favorably',
    },
    explanation: {
      es: 'Cierra una presentación y expresa el deseo de una buena relación. Su traducción cambia según la situación.',
      en: 'It closes an introduction and expresses hope for a good relationship. Its translation changes with context.',
    },
    example: {
      target: 'アルベルトです。よろしくお願いします。',
      reading: 'アルベルトです。よろしくおねがいします。',
      es: 'Soy Alberto. Mucho gusto.',
      en: 'I’m Alberto. Pleased to meet you.',
    },
    structure: [
      {
        form: 'お願い',
        reading: 'おねがい',
        meanings: { es: 'petición; favor', en: 'request; favor' },
      },
    ],
  },
];

const daySeeds = [
  ['monday', '月曜日', 'げつようび', 'lunes', 'Monday', '月', 'luna', 'moon'],
  ['tuesday', '火曜日', 'かようび', 'martes', 'Tuesday', '火', 'fuego', 'fire'],
  ['wednesday', '水曜日', 'すいようび', 'miércoles', 'Wednesday', '水', 'agua', 'water'],
  ['thursday', '木曜日', 'もくようび', 'jueves', 'Thursday', '木', 'árbol', 'tree'],
  ['friday', '金曜日', 'きんようび', 'viernes', 'Friday', '金', 'oro; metal', 'gold; metal'],
  ['saturday', '土曜日', 'どようび', 'sábado', 'Saturday', '土', 'tierra', 'earth'],
  ['sunday', '日曜日', 'にちようび', 'domingo', 'Sunday', '日', 'sol; día', 'sun; day'],
] as const;

const days = daySeeds.map(
  ([id, target, reading, es, en, symbol, symbolEs, symbolEn], index) =>
    makeEntry({
      id: `notes-day-${id}`,
      lessonId: 'notes-days-of-week',
      target,
      reading,
      partOfSpeech: noun,
      meanings: { es, en },
      explanation: {
        es: `${symbol} aporta la imagen de ${symbolEs}; 曜日 completa el nombre de un día de la semana.`,
        en: `${symbol} contributes the image of ${symbolEn}; 曜日 completes the name of a weekday.`,
      },
      example: {
        target:
          index === 0
            ? `今日は${target}です。`
            : `${target}に日本語を勉強します。`,
        reading:
          index === 0
            ? `きょうは${reading}です。`
            : `${reading}ににほんごをべんきょうします。`,
        es:
          index === 0
            ? `Hoy es ${es}.`
            : `Estudio japonés el ${es}.`,
        en:
          index === 0
            ? `Today is ${en}.`
            : `I study Japanese on ${en}.`,
      },
      structure: [
        {
          form: symbol,
          meanings: { es: symbolEs, en: symbolEn },
        },
        {
          form: '曜日',
          reading: 'ようび',
          meanings: { es: 'día de la semana', en: 'day of the week' },
        },
      ],
    }),
);

const generalCounterSeeds = [
  ['one', '一つ', 'ひとつ', 'una cosa', 'one thing'],
  ['two', '二つ', 'ふたつ', 'dos cosas', 'two things'],
  ['three', '三つ', 'みっつ', 'tres cosas', 'three things'],
  ['four', '四つ', 'よっつ', 'cuatro cosas', 'four things'],
  ['five', '五つ', 'いつつ', 'cinco cosas', 'five things'],
  ['six', '六つ', 'むっつ', 'seis cosas', 'six things'],
  ['seven', '七つ', 'ななつ', 'siete cosas', 'seven things'],
  ['eight', '八つ', 'やっつ', 'ocho cosas', 'eight things'],
  ['nine', '九つ', 'ここのつ', 'nueve cosas', 'nine things'],
  ['ten', '十', 'とお', 'diez cosas', 'ten things'],
] as const;

const counters = generalCounterSeeds.map(([id, target, reading, es, en], index) =>
  makeEntry({
    id: `notes-counter-${id}`,
    lessonId: 'notes-general-counter',
    target,
    reading,
    partOfSpeech: { es: 'contador', en: 'counter expression' },
    meanings: { es, en },
    explanation: {
      es: `${reading} pertenece al sistema japonés tradicional para contar objetos generales del ${index + 1} al 10.`,
      en: `${reading} belongs to the traditional Japanese system for counting general objects from 1 to 10.`,
    },
    example: {
      target: `りんごが${target}あります。`,
      reading: `りんごが${reading}あります。`,
      es: `Hay ${es.replace(' cosa', ' manzana').replace(' cosas', ' manzanas')}.`,
      en: `There ${index === 0 ? 'is' : 'are'} ${en.replace('thing', 'apple').replace('things', 'apples')}.`,
    },
    structure:
      target === '十'
        ? []
        : [
            {
              form: target.slice(0, 1),
              meanings: {
                es: `número ${index + 1}`,
                en: `number ${index + 1}`,
              },
            },
            {
              form: 'つ',
              meanings: {
                es: 'contador general',
                en: 'general counter',
              },
            },
          ],
  }),
);

export const japaneseStudyNotesPack = parseContentPack({
  schemaVersion: 1,
  contentVersion: '0.3.0',
  packId: 'japanese-study-notes',
  courseId: 'ja-basic',
  languageTag: 'ja',
  title: {
    es: 'Japonés para el estudio diario',
    en: 'Japanese for daily study',
  },
  description: {
    es: 'Lecciones originales creadas a partir del alcance de las notas privadas del estudiante.',
    en: 'Original lessons created from the scope of the learner’s private study notes.',
  },
  authors: ['Alberto Ceballos Villa', 'Nihongo no Kotoba contributors'],
  license: {
    name: 'CC-BY-4.0',
    url: 'https://creativecommons.org/licenses/by/4.0/',
  },
  sourceNotes: [
    'El alcance temático se contrastó con notas privadas aportadas por el estudiante.',
    'Las explicaciones, traducciones y frases de ejemplo son redacción original para este proyecto.',
    'No existe afiliación con Minna no Nihongo ni se redistribuyen páginas escaneadas.',
  ],
  lessons: [
    {
      id: 'notes-lesson-01',
      order: 1,
      title: { es: 'Presentarse', en: 'Introducing yourself' },
      description: {
        es: 'Personas, profesiones y expresiones para una primera presentación.',
        en: 'People, occupations, and expressions for a first introduction.',
      },
    },
    {
      id: 'notes-days-of-week',
      order: 1001,
      kind: 'special',
      title: { es: 'Días de la semana', en: 'Days of the week' },
      description: {
        es: 'Los siete días entendidos a través del kanji que los distingue.',
        en: 'The seven weekdays understood through their distinguishing kanji.',
      },
    },
    {
      id: 'notes-general-counter',
      order: 1002,
      kind: 'special',
      title: { es: 'Contador general つ', en: 'General counter つ' },
      description: {
        es: 'La serie tradicional para contar de una a diez cosas.',
        en: 'The traditional series for counting one to ten general things.',
      },
    },
  ],
  entries: [
    ...introductions.map(makeEntry),
    ...days,
    ...counters,
  ],
});
