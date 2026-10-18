export type LanguageCode = 
  | 'en' 
  | 'hi' 
  | 'ur' 
  | 'ar' 
  | 'es' 
  | 'fr' 
  | 'de' 
  | 'pt' 
  | 'id' 
  | 'tr' 
  | 'bn' 
  | 'ta';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', rtl: true },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
];

// English is the fallback; other languages are fetched only when selected.
import english from './locales/en';

export const UI_TRANSLATIONS: Partial<Record<LanguageCode, Record<string, string>>> = { en: english };
const languageLoaders = {
  hi: () => import('./locales/hi'),
  ur: () => import('./locales/ur'),
  ar: () => import('./locales/ar'),
  es: () => import('./locales/es'),
  fr: () => import('./locales/fr'),
  de: () => import('./locales/de'),
  pt: () => import('./locales/pt'),
  id: () => import('./locales/id'),
  tr: () => import('./locales/tr'),
  bn: () => import('./locales/bn'),
  ta: () => import('./locales/ta'),
};
const pendingLoads = new Map<LanguageCode, Promise<void>>();

export function isLanguageCode(value: unknown): value is LanguageCode {
  return SUPPORTED_LANGUAGES.some(language => language.code === value);
}

export function getPreferredLanguage(): LanguageCode {
  try {
    const saved = localStorage.getItem('zubware-lang');
    if (isLanguageCode(saved)) return saved;
  } catch { /* Storage may be restricted. */ }
  return detectBrowserLanguage();
}

export function loadLanguage(lang: LanguageCode): Promise<void> {
  if (!isLanguageCode(lang)) return Promise.reject(new Error('Unsupported language'));
  if (UI_TRANSLATIONS[lang]) return Promise.resolve();
  const pending = pendingLoads.get(lang);
  if (pending) return pending;
  const request = languageLoaders[lang as Exclude<LanguageCode, 'en'>]()
    .then(module => { UI_TRANSLATIONS[lang] = module.default; })
    .finally(() => { pendingLoads.delete(lang); });
  pendingLoads.set(lang, request);
  return request;
}

export function getTranslation(lang: LanguageCode, key: string, fallback?: string): string {
  const trans = UI_TRANSLATIONS[lang]?.[key] || UI_TRANSLATIONS.en?.[key];
  if (trans) return trans;
  return fallback || key;
}

export function detectBrowserLanguage(): LanguageCode {
  if (typeof window === 'undefined' || !navigator) return 'en';
  try {
    const navLang = (navigator.language || (navigator as any).userLanguage || '').toLowerCase();
    if (navLang.startsWith('hi')) return 'hi';
    if (navLang.startsWith('ur')) return 'ur';
    if (navLang.startsWith('ar')) return 'ar';
    if (navLang.startsWith('es')) return 'es';
    if (navLang.startsWith('fr')) return 'fr';
    if (navLang.startsWith('de')) return 'de';
    if (navLang.startsWith('pt')) return 'pt';
    if (navLang.startsWith('id')) return 'id';
    if (navLang.startsWith('tr')) return 'tr';
    if (navLang.startsWith('bn')) return 'bn';
    if (navLang.startsWith('ta')) return 'ta';
  } catch {
    // fallback
  }
  return 'en';
}
