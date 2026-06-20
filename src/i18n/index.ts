import { getAbsoluteLocaleUrl } from "astro:i18n";

import {
	DEFAULT_LOCALE,
	LOCALE_HTML_LANG,
	LOCALE_LABELS,
	LOCALE_OG,
	LOCALES,
	type Locale,
} from "./config";
import en from "./locales/en";
import es from "./locales/es";
import ptBr from "./locales/pt-br";
import type { Translations } from "./types";

const translations: Record<Locale, Translations> = {
	"pt-br": ptBr,
	en,
	es,
};

export function useTranslations(locale: Locale): Translations {
	return translations[locale];
}

export function getHtmlLang(locale: Locale): string {
	return LOCALE_HTML_LANG[locale];
}

export function getOgLocale(locale: Locale): string {
	return LOCALE_OG[locale];
}

export function getLocaleUrl(locale: Locale): string {
	return getAbsoluteLocaleUrl(locale);
}

export function getLocaleAlternates(): {
	locale: Locale;
	href: string;
	hreflang: string;
}[] {
	return (Object.keys(translations) as Locale[]).map((locale) => ({
		locale,
		href: getLocaleUrl(locale),
		hreflang: LOCALE_HTML_LANG[locale],
	}));
}

export function getDefaultLocaleUrl(): string {
	return getLocaleUrl(DEFAULT_LOCALE);
}

export {
	DEFAULT_LOCALE,
	LOCALE_LABELS,
	LOCALES,
	type Locale,
	type Translations,
};
