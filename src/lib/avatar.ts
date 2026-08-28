// Initialen + Farbe für den Avatar-Fallback, wenn kein avatar_url gesetzt ist.
// Farbe wird deterministisch aus dem Namen abgeleitet (kein Zufall), damit
// dieselbe Person bei jedem Rendern denselben Kreis bekommt.

const PALETTE = ['#8BC53F', '#4C7A1F', '#E0A83A', '#B4711A', '#5A6B57', '#0F1F13'];

export function avatarInitials(name: string): string {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return '?';
	const first = parts[0][0] ?? '';
	const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : '';
	return (first + last).toUpperCase() || '?';
}

export function avatarColor(seed: string): string {
	let hash = 0;
	for (let i = 0; i < seed.length; i++) {
		hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
	}
	return PALETTE[hash % PALETTE.length];
}
