import { describe, it, expect, beforeAll, beforeEach, afterEach } from 'vitest';
import {
  registerTranslation,
  getLang,
  setLang,
  t,
  getMeaning,
  getNote,
  getDeclGeneralNote,
  applyTranslations,
} from '../../js/i18n.js';

// Register test translations once (module-level I18N state persists across tests)
beforeAll(() => {
  registerTranslation('pt', {
    'greeting': 'Olá',
    'farewell': 'Adeus',
    'with.args': 'Olá {0}, bem-vindo a {1}!',
    'only.pt': 'Somente português',
  }, {
    'rosa': 'rosa',
    'dominus': 'senhor',
  }, {
    'rosa': 'Nota sobre rosa',
  }, {
    'III': 'Nota geral da 3a declinação',
  });

  registerTranslation('en', {
    'greeting': 'Hello',
    'farewell': 'Goodbye',
    'with.args': 'Hello {0}, welcome to {1}!',
  }, {
    'rosa': 'rose',
  }, {
    'rosa': 'Note about rosa',
  }, {
    'III': 'General note for 3rd declension',
  });
});

// Reset to default lang before each test (avoid localStorage.clear which may not exist in all envs)
beforeEach(() => {
  setLang('pt');
});

// ── registerTranslation ──────────────────────────────────────────────

describe('registerTranslation', () => {
  it('registers a language with only strings (meanings/notes/declGeneralNotes default to {})', () => {
    registerTranslation('de', { 'greeting': 'Hallo' });
    // Verify by switching to 'de' and using the translation
    setLang('de');
    expect(t('greeting')).toBe('Hallo');
  });

  it('registers a language with all five arguments', () => {
    registerTranslation('fr', {
      'greeting': 'Bonjour',
    }, {
      'rosa': 'rose (fr)',
    }, {
      'rosa': 'Note fr',
    }, {
      'III': 'Note gen fr',
    });
    setLang('fr');
    expect(t('greeting')).toBe('Bonjour');
    expect(getMeaning('rosa')).toBe('rose (fr)');
    expect(getNote('rosa')).toBe('Note fr');
    expect(getDeclGeneralNote('III')).toBe('Note gen fr');
  });
});

// ── getLang / setLang ────────────────────────────────────────────────

describe('getLang / setLang', () => {
  it('defaults to "pt" as the base language', () => {
    // beforeEach sets lang to 'pt', which is the app default
    expect(getLang()).toBe('pt');
  });

  it('returns the language set via setLang', () => {
    setLang('en');
    expect(getLang()).toBe('en');
  });
});

// ── t (translation) ─────────────────────────────────────────────────

describe('t', () => {
  it('returns the translated string for the current language', () => {
    setLang('en');
    expect(t('greeting')).toBe('Hello');
  });

  it('falls back to pt when key is missing in the current language', () => {
    setLang('en');
    expect(t('only.pt')).toBe('Somente português');
  });

  it('returns the key itself when it exists in neither current lang nor pt', () => {
    setLang('en');
    expect(t('nonexistent.key')).toBe('nonexistent.key');
  });

  it('falls back to pt translations when current lang has no translations at all', () => {
    setLang('xx');
    expect(t('greeting')).toBe('Olá');
  });

  it('replaces {0}, {1} placeholders with extra arguments', () => {
    setLang('en');
    expect(t('with.args', 'Alice', 'Rome')).toBe('Hello Alice, welcome to Rome!');
  });

  it('replaces placeholders in the pt fallback', () => {
    setLang('pt');
    expect(t('with.args', 'Maria', 'Roma')).toBe('Olá Maria, bem-vindo a Roma!');
  });

  it('returns the key when no translations are registered for any language', () => {
    setLang('zz');
    expect(t('nonexistent.key')).toBe('nonexistent.key');
  });
});

// ── getMeaning ───────────────────────────────────────────────────────

describe('getMeaning', () => {
  it('returns the meaning for a known word', () => {
    setLang('pt');
    expect(getMeaning('rosa')).toBe('rosa');
  });

  it('returns the English meaning when lang is en', () => {
    setLang('en');
    expect(getMeaning('rosa')).toBe('rose');
  });

  it('returns the nominative itself when the word is unknown', () => {
    setLang('pt');
    expect(getMeaning('unknownword')).toBe('unknownword');
  });

  it('falls back to pt meanings when current lang has no meanings', () => {
    setLang('de');
    expect(getMeaning('rosa')).toBe('rosa');
  });
});

// ── getNote ──────────────────────────────────────────────────────────

describe('getNote', () => {
  it('returns the note for a known word', () => {
    setLang('pt');
    expect(getNote('rosa')).toBe('Nota sobre rosa');
  });

  it('returns null for an unknown word', () => {
    setLang('pt');
    expect(getNote('unknownword')).toBeNull();
  });

  it('falls back to pt notes when current lang has no notes registered', () => {
    setLang('xx');
    expect(getNote('rosa')).toBe('Nota sobre rosa');
  });
});

// ── getDeclGeneralNote ───────────────────────────────────────────────

describe('getDeclGeneralNote', () => {
  it('returns the general note for a known declension', () => {
    setLang('pt');
    expect(getDeclGeneralNote('III')).toBe('Nota geral da 3a declinação');
  });

  it('returns the English note when lang is en', () => {
    setLang('en');
    expect(getDeclGeneralNote('III')).toBe('General note for 3rd declension');
  });

  it('returns null for an unknown declension', () => {
    setLang('pt');
    expect(getDeclGeneralNote('X')).toBeNull();
  });

  it('falls back to pt when current lang has no declGeneralNotes registered', () => {
    setLang('xx');
    expect(getDeclGeneralNote('III')).toBe('Nota geral da 3a declinação');
  });
});

// ── applyTranslations ────────────────────────────────────────────────

describe('applyTranslations', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('sets textContent on a div with data-i18n', () => {
    setLang('en');
    document.body.innerHTML = '<div data-i18n="greeting"></div>';
    applyTranslations();
    expect(document.querySelector('[data-i18n]').textContent).toBe('Hello');
  });

  it('sets placeholder on an INPUT with data-i18n', () => {
    setLang('en');
    document.body.innerHTML = '<input data-i18n="greeting" />';
    applyTranslations();
    expect(document.querySelector('input').placeholder).toBe('Hello');
  });

  it('sets placeholder on a TEXTAREA with data-i18n', () => {
    setLang('en');
    document.body.innerHTML = '<textarea data-i18n="greeting"></textarea>';
    applyTranslations();
    expect(document.querySelector('textarea').placeholder).toBe('Hello');
  });

  it('sets innerHTML on an element with data-i18n-html', () => {
    setLang('en');
    document.body.innerHTML = '<span data-i18n-html="greeting"></span>';
    applyTranslations();
    expect(document.querySelector('[data-i18n-html]').innerHTML).toBe('Hello');
  });

  it('sets title on an element with data-i18n-title', () => {
    setLang('en');
    document.body.innerHTML = '<button data-i18n-title="greeting"></button>';
    applyTranslations();
    expect(document.querySelector('[data-i18n-title]').title).toBe('Hello');
  });

  it('handles multiple elements of different types', () => {
    setLang('pt');
    document.body.innerHTML = `
      <div data-i18n="greeting"></div>
      <input data-i18n="farewell" />
      <span data-i18n-html="greeting"></span>
      <a data-i18n-title="farewell"></a>
    `;
    applyTranslations();
    expect(document.querySelector('div').textContent).toBe('Olá');
    expect(document.querySelector('input').placeholder).toBe('Adeus');
    expect(document.querySelector('span').innerHTML).toBe('Olá');
    expect(document.querySelector('a').title).toBe('Adeus');
  });
});
