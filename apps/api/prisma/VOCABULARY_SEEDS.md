# Vocabulary Seed Format

The vocabulary seed files power `prisma db seed` and the CLI import script. Use either JSON or CSV.

## Required fields
- `word` (string)
- `phonetic` (string, IPA)
- `audio` (string, use `tts:<word>` for TTS)
- `definition` (string)
- `example` (string)
- `level` (`A1` | `A2` | `B1` | `B2` | `C1` | `C2`)
- `topic` (one of the topics below)
- `partOfSpeech` (one of the parts of speech below)

## Topics
- `Daily Life`
- `Travel & Transportation`
- `Food & Dining`
- `Business`
- `Work`
- `Education`
- `Health & Medicine`
- `Technology`
- `Arts & Culture`
- `Nature & Environment`
- `Sports & Hobbies`
- `Emotions & Feelings`
- `Time & Dates`

## Parts of Speech
- `noun`
- `verb`
- `adjective`
- `adverb`
- `preposition`
- `conjunction`
- `interjection`

## JSON example
```json
[
  {
    "word": "hello",
    "phonetic": "/həˈloʊ/",
    "audio": "tts:hello",
    "definition": "A greeting or expression of goodwill.",
    "example": "Hello, how are you?",
    "level": "A1",
    "topic": "Daily Life",
    "partOfSpeech": "interjection"
  }
]
```

## CSV example
```csv
word,phonetic,audio,definition,example,level,topic,partOfSpeech
hello,/həˈloʊ/,tts:hello,"A greeting or expression of goodwill.","Hello, how are you?",A1,Daily Life,interjection
```

## Import usage
- Seed default file: `npm run prisma:seed`
- Import custom file: `npm run vocab:import -- <path-to-json-or-csv>`
