import { describe, expect, it } from 'vitest';
import { hreflangLinksFor } from './hreflang';

describe('hreflangLinksFor', () => {
	it('liefert für jede Sprache plus x-default eine URL', () => {
		const links = hreflangLinksFor('/ratgeber/tennis-regeln');
		const hreflangs = links.map((l) => l.hreflang).sort();
		expect(hreflangs).toEqual(['de', 'en', 'es', 'x-default']);
	});

	it('setzt die richtigen Präfixe pro Sprache', () => {
		const links = hreflangLinksFor('/rating');
		const byLang = Object.fromEntries(links.map((l) => [l.hreflang, l.href]));
		expect(byLang.de).toBe('https://tennisindex.eu/rating');
		expect(byLang.en).toBe('https://tennisindex.eu/en/rating');
		expect(byLang.es).toBe('https://tennisindex.eu/es/rating');
	});

	it('x-default zeigt auf die deutsche (Basis-)Version', () => {
		const links = hreflangLinksFor('/vereine');
		const xDefault = links.find((l) => l.hreflang === 'x-default');
		const de = links.find((l) => l.hreflang === 'de');
		expect(xDefault?.href).toBe(de?.href);
	});

	it('funktioniert für die Startseite ("/")', () => {
		const links = hreflangLinksFor('/');
		const byLang = Object.fromEntries(links.map((l) => [l.hreflang, l.href]));
		expect(byLang.de).toBe('https://tennisindex.eu/');
		expect(byLang.en).toBe('https://tennisindex.eu/en');
		expect(byLang.es).toBe('https://tennisindex.eu/es');
	});

	it('gibt für eine In-Scope-Seite mit Unterpfad korrekte Präfixe', () => {
		const links = hreflangLinksFor('/ratgeber/tennis-schuhe');
		const byLang = Object.fromEntries(links.map((l) => [l.hreflang, l.href]));
		expect(byLang.en).toBe('https://tennisindex.eu/en/ratgeber/tennis-schuhe');
		expect(byLang.es).toBe('https://tennisindex.eu/es/ratgeber/tennis-schuhe');
	});

	it('funktioniert auch, wenn der übergebene Pfad bereits lokalisiert ist (page.url.pathname auf /en/…)', () => {
		const links = hreflangLinksFor('/en/rating');
		const byLang = Object.fromEntries(links.map((l) => [l.hreflang, l.href]));
		expect(byLang.de).toBe('https://tennisindex.eu/rating');
		expect(byLang.en).toBe('https://tennisindex.eu/en/rating');
		expect(byLang.es).toBe('https://tennisindex.eu/es/rating');
	});
});
