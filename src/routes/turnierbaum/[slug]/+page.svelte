<script lang="ts">
	// ============================================================
	// TennisIndex — /turnierbaum/[slug]
	// ============================================================
	// Öffentliche Baum-Ansicht: Gewinner-Seite, Verlierer-Seite und Finale
	// als eigene, horizontal scrollbare Rundenspalten — bewusst schlicht
	// (keine Verbindungslinien zwischen Partien), aber mit vollständigem
	// Ergebnis-/Freilos-/Kampflos-Status je Partie.

	import LandingNav from '$lib/components/landing/LandingNav.svelte';
	import LandingFooter from '$lib/components/landing/LandingFooter.svelte';
	import { reveal } from '$lib/landing/reveal';
	import { mainNav } from '$lib/landing/nav';
	import type { PageData } from './$types';
	import type { BracketMatchView, BracketSide } from '$lib/server/bracket';

	let { data }: { data: PageData } = $props();

	function roundsOf(side: BracketSide): [number, BracketMatchView[]][] {
		const rounds = new Map<number, BracketMatchView[]>();
		for (const m of data.matches) {
			if (m.bracket !== side) continue;
			const list = rounds.get(m.round) ?? [];
			list.push(m);
			rounds.set(m.round, list);
		}
		return [...rounds.entries()].sort((a, b) => a[0] - b[0]);
	}

	const winnersRounds = $derived(roundsOf('winners'));
	const losersRounds = $derived(roundsOf('losers'));
	const grandFinalRounds = $derived(roundsOf('grand_final'));

	function roundLabel(side: BracketSide, round: number, totalRounds: number): string {
		if (side === 'grand_final') return round === 1 ? 'Finale' : 'Finale (Wiederholung)';
		const fromEnd = totalRounds - round;
		if (fromEnd === 0) return 'Finale';
		if (fromEnd === 1) return 'Halbfinale';
		if (fromEnd === 2) return 'Viertelfinale';
		return `Runde ${round}`;
	}

	function scoreLabel(m: BracketMatchView): string {
		if (m.status === 'bye') return 'Freilos';
		if (m.status === 'walkover') return 'kampflos';
		if (m.sets.length === 0) return '–';
		return m.sets.map((s) => `${s.team1Games}:${s.team2Games}`).join(', ');
	}

	const statusLabel: Record<string, string> = {
		pending: 'wartet',
		scheduled: 'offen',
		bye: 'Freilos',
		walkover: 'kampflos',
		played: 'gespielt'
	};
</script>

<svelte:head>
	<title>{data.event.name} — Turnierbaum | TennisIndex</title>
	<meta
		name="description"
		content={`Doppel-K.o.-Turnierbaum von ${data.event.name}${data.event.clubName ? ` beim ${data.event.clubName}` : ''} auf TennisIndex.`}
	/>
	<meta name="theme-color" content="#0F1F13" />
</svelte:head>

<LandingNav links={mainNav()} />

<main>
	<section class="sec sec-light" id="top">
		<div class="wrap">
			<div class="sec-head">
				<span class="eyebrow" use:reveal>Turnierbaum</span>
				<h1 use:reveal={{ delay: 0.05 }}>{data.event.name}</h1>
				<p class="muted" use:reveal={{ delay: 0.1 }}>
					{data.event.category === 'doubles' ? 'Doppel' : 'Einzel'} · Doppel-K.o.
					{#if data.event.clubName}· {data.event.clubName}{/if}
					{#if data.event.status === 'draft'}
						<span class="pill">Auslosung ausstehend</span>
					{:else if data.event.status === 'completed'}
						<span class="pill pill-done">abgeschlossen</span>
					{:else}
						<span class="pill pill-open">läuft</span>
					{/if}
				</p>
			</div>

			{#if data.event.status === 'draft'}
				<p class="empty" use:reveal>Die Auslosung für dieses Turnier steht noch aus.</p>
			{:else}
				<div class="brackets">
					<section use:reveal>
						<h2 class="side-h">Gewinner-Seite</h2>
						<div class="bracket-rounds">
							{#each winnersRounds as [round, matches] (round)}
								<div class="round-col">
									<h3 class="round-h">{roundLabel('winners', round, winnersRounds.length)}</h3>
									{#each matches as m (m.id)}
										<article class="match-card" class:done={m.status === 'played'}>
											<div class="side" class:winner={m.winnerEntryId === m.entry1?.id}>
												{m.entry1?.displayName ?? '—'}
											</div>
											<div class="side" class:winner={m.winnerEntryId === m.entry2?.id}>
												{m.entry2?.displayName ?? '—'}
											</div>
											<div class="meta">
												<span class="score num">{scoreLabel(m)}</span>
												{#if m.status === 'pending' || m.status === 'scheduled'}
													<span class="pill" class:pill-open={m.status === 'scheduled'}
														>{statusLabel[m.status]}</span
													>
												{/if}
											</div>
										</article>
									{/each}
								</div>
							{/each}
						</div>
					</section>

					{#if losersRounds.length > 0}
						<section use:reveal>
							<h2 class="side-h">Verlierer-Seite</h2>
							<div class="bracket-rounds">
								{#each losersRounds as [round, matches] (round)}
									<div class="round-col">
										<h3 class="round-h">Runde {round}</h3>
										{#each matches as m (m.id)}
											<article class="match-card" class:done={m.status === 'played'}>
												<div class="side" class:winner={m.winnerEntryId === m.entry1?.id}>
													{m.entry1?.displayName ?? '—'}
												</div>
												<div class="side" class:winner={m.winnerEntryId === m.entry2?.id}>
													{m.entry2?.displayName ?? '—'}
												</div>
												<div class="meta">
													<span class="score num">{scoreLabel(m)}</span>
													{#if m.status === 'pending' || m.status === 'scheduled'}
														<span class="pill" class:pill-open={m.status === 'scheduled'}
															>{statusLabel[m.status]}</span
														>
													{/if}
												</div>
											</article>
										{/each}
									</div>
								{/each}
							</div>
						</section>
					{/if}

					<section use:reveal>
						<h2 class="side-h">Finale</h2>
						<div class="bracket-rounds">
							{#each grandFinalRounds as [round, matches] (round)}
								<div class="round-col">
									<h3 class="round-h">{roundLabel('grand_final', round, grandFinalRounds.length)}</h3>
									{#each matches as m (m.id)}
										<article class="match-card" class:done={m.status === 'played'}>
											<div class="side" class:winner={m.winnerEntryId === m.entry1?.id}>
												{m.entry1?.displayName ?? '—'}
											</div>
											<div class="side" class:winner={m.winnerEntryId === m.entry2?.id}>
												{m.entry2?.displayName ?? '—'}
											</div>
											<div class="meta">
												<span class="score num">{scoreLabel(m)}</span>
												{#if m.status === 'pending' || m.status === 'scheduled'}
													<span class="pill" class:pill-open={m.status === 'scheduled'}
														>{statusLabel[m.status]}</span
													>
												{/if}
											</div>
										</article>
									{/each}
								</div>
							{/each}
						</div>
					</section>
				</div>

				{#if data.event.status === 'completed' && data.event.championEntryId}
					{@const champion = data.matches
						.flatMap((m) => [m.entry1, m.entry2])
						.find((e) => e?.id === data.event.championEntryId)}
					{#if champion}
						<p class="champion" use:reveal>🏆 Turniersieger:in: <strong>{champion.displayName}</strong></p>
					{/if}
				{/if}
			{/if}
		</div>
	</section>
</main>

<LandingFooter />

<style>
	h1 {
		margin-top: 18px;
	}
	.sec-head .muted {
		margin-top: 14px;
	}
	.pill {
		display: inline-block;
		margin-left: 8px;
		padding: 2px 9px;
		border-radius: 100px;
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--muted-light);
		border: 1px solid var(--line-light, rgba(0, 0, 0, 0.14));
	}
	.pill-open {
		color: #4c7a1f;
		border-color: rgba(76, 122, 31, 0.3);
	}
	.pill-done {
		color: var(--muted-light);
	}
	.empty {
		margin-top: 24px;
		color: var(--muted-light);
	}
	.brackets {
		margin-top: 36px;
		display: flex;
		flex-direction: column;
		gap: 40px;
	}
	.side-h {
		font-size: 18px;
		margin-bottom: 16px;
	}
	.bracket-rounds {
		display: flex;
		gap: 20px;
		overflow-x: auto;
		padding-bottom: 10px;
	}
	.round-col {
		min-width: 230px;
		display: flex;
		flex-direction: column;
		gap: 14px;
		flex-shrink: 0;
	}
	.round-h {
		font-size: 12px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--muted-light);
		margin: 0;
	}
	.match-card {
		border: 1px solid var(--line-light, rgba(0, 0, 0, 0.14));
		border-radius: 12px;
		padding: 10px 12px;
		background: #fff;
	}
	.match-card.done {
		background: rgba(76, 122, 31, 0.04);
	}
	.side {
		font-size: 13px;
		padding: 3px 0;
	}
	.side.winner {
		font-weight: 700;
	}
	.meta {
		margin-top: 6px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.score {
		font-size: 12px;
		color: var(--muted-light);
	}
	.champion {
		margin-top: 32px;
		font-size: 18px;
		text-align: center;
	}
</style>
