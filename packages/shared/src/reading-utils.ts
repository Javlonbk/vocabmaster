export type VocabSegment = {
  text: string;
  isVocab: boolean;
};

const vocabTagRegex = /<vocab>(.*?)<\/vocab>/gi;

export function parseVocabMarkup(content: string): VocabSegment[] {
  const segments: VocabSegment[] = [];
  let lastIndex = 0;

  for (const match of content.matchAll(vocabTagRegex)) {
    const matchIndex = match.index ?? 0;
    if (matchIndex > lastIndex) {
      segments.push({ text: content.slice(lastIndex, matchIndex), isVocab: false });
    }

    const word = match[1] ?? '';
    if (word) {
      segments.push({ text: word, isVocab: true });
    }

    lastIndex = matchIndex + match[0].length;
  }

  if (lastIndex < content.length) {
    segments.push({ text: content.slice(lastIndex), isVocab: false });
  }

  return segments;
}

export function stripVocabMarkup(content: string): string {
  return content.replace(vocabTagRegex, '$1');
}

export function extractVocabWords(content: string): string[] {
  const words: string[] = [];
  for (const match of content.matchAll(vocabTagRegex)) {
    if (match[1]) {
      words.push(match[1]);
    }
  }
  return words;
}

export type PopupPlacement = {
  left: number;
  top: number;
};

export function clampPopupPosition(options: {
  anchorX: number;
  anchorY: number;
  popupWidth: number;
  popupHeight: number;
  screenWidth: number;
  screenHeight: number;
  margin?: number;
}): PopupPlacement {
  const margin = options.margin ?? 12;
  const preferredLeft = options.anchorX - options.popupWidth / 2;
  const preferredTop = options.anchorY - options.popupHeight - margin;

  const left = Math.min(
    Math.max(preferredLeft, margin),
    Math.max(margin, options.screenWidth - options.popupWidth - margin)
  );

  let top = preferredTop;
  if (top < margin) {
    top = Math.min(options.anchorY + margin, options.screenHeight - options.popupHeight - margin);
  }

  return { left, top };
}
