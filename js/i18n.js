// ═══════════════════════════════════════════════════════════════════════
// i18n — Lightweight translation engine
// ═══════════════════════════════════════════════════════════════════════

const I18N = {
  translations: {},
  meanings: {},
  notes: {},
  declGeneralNotes: {},
};

export function registerTranslation(lang, strings, meanings, notes, declGeneralNotes) {
  I18N.translations[lang] = strings;
  I18N.meanings[lang] = meanings || {};
  I18N.notes[lang] = notes || {};
  I18N.declGeneralNotes[lang] = declGeneralNotes || {};
}

export function getLang() {
  return localStorage.getItem('latin-lang') || 'pt';
}

export function setLang(code) {
  localStorage.setItem('latin-lang', code);
}

export function t(key) {
  const lang = getLang();
  const strings = I18N.translations[lang] || I18N.translations['pt'] || {};
  let str = strings[key];
  if (str === undefined) {
    // Fallback to Portuguese
    const fallback = I18N.translations['pt'] || {};
    str = fallback[key];
  }
  if (str === undefined) return key;
  // Replace {0}, {1}, ... with extra arguments
  if (arguments.length > 1) {
    for (let i = 1; i < arguments.length; i++) {
      str = str.replace('{' + (i - 1) + '}', arguments[i]);
    }
  }
  return str;
}

export function getMeaning(nom) {
  const lang = getLang();
  const m = I18N.meanings[lang] || I18N.meanings['pt'] || {};
  return m[nom] || nom;
}

export function getNote(nom) {
  const lang = getLang();
  const n = I18N.notes[lang] || I18N.notes['pt'] || {};
  return n[nom] || null;
}

export function getDeclGeneralNote(dec) {
  const lang = getLang();
  const n = I18N.declGeneralNotes[lang] || I18N.declGeneralNotes['pt'] || {};
  return n[dec] || null;
}

export function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var key = el.getAttribute('data-i18n');
    var translated = t(key);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = translated;
    } else {
      el.textContent = translated;
    }
  });
  // Also handle data-i18n-html for HTML content
  document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
    var key = el.getAttribute('data-i18n-html');
    el.innerHTML = t(key);
  });
  // Also handle data-i18n-title for title attributes
  document.querySelectorAll('[data-i18n-title]').forEach(function(el) {
    var key = el.getAttribute('data-i18n-title');
    el.title = t(key);
  });
}
