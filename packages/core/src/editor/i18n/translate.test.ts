import { describe, it, expect } from 'vitest';
import { defaultLabels } from './default-labels';
import { createTranslator, englishTranslator } from './translate';

describe('createTranslator', () => {
  it('returns the English default for a known key', () => {
    expect(englishTranslator('toolbar.bold')).toBe('Bold');
  });

  it('interpolates {token} placeholders', () => {
    expect(englishTranslator('placeholder.heading', { level: 2 })).toBe(
      'Heading 2'
    );
  });

  it('leaves a placeholder intact when its var is missing', () => {
    expect(englishTranslator('placeholder.heading')).toBe('Heading {level}');
  });

  it('uses caller-supplied labels verbatim (no merge)', () => {
    const fr = { ...defaultLabels, 'toolbar.bold': 'Gras' };
    const t = createTranslator(fr);
    expect(t('toolbar.bold')).toBe('Gras');
    expect(t('toolbar.italic')).toBe('Italic'); // untouched key still English here
  });

  it('has no empty default values', () => {
    for (const [key, value] of Object.entries(defaultLabels)) {
      expect(value, `empty label for ${key}`).not.toBe('');
    }
  });
});
