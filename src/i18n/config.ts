export const LOCALES = ["pt-br", "en", "es"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "pt-br";

export const LOCALE_LABELS: Record<Locale, string> = {
	"pt-br": "PT",
	en: "EN",
	es: "ES",
};

export const LOCALE_HTML_LANG: Record<Locale, string> = {
	"pt-br": "pt-BR",
	en: "en",
	es: "es",
};

export const LOCALE_OG: Record<Locale, string> = {
	"pt-br": "pt_BR",
	en: "en_US",
	es: "es_ES",
};

export function isLocale(value: string): value is Locale {
	return LOCALES.includes(value as Locale);
}
