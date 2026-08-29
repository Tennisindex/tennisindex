import type { CapacitorConfig } from '@capacitor/cli';

// TennisIndex ist serverseitig gerendert (SvelteKit + Cloudflare Workers,
// Supabase-Login-Sessions, Formulare, Live-Ratings) — kein statischer
// Build, der sinnvoll in eine App gebündelt werden könnte. Die App lädt
// deshalb direkt die Produktions-Website in der WebView, siehe
// capacitor-shell/index.html für die Begründung des Platzhalter-webDir.
const config: CapacitorConfig = {
	appId: 'eu.tennisindex.app',
	appName: 'TennisIndex',
	webDir: 'capacitor-shell',
	server: {
		url: 'https://tennisindex.eu',
		// Nur HTTPS — kein Klartext-HTTP für die produktiv genutzte App.
		cleartext: false
	}
};

export default config;
