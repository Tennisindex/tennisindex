<script lang="ts">
	import MinimalNav from '$lib/components/MinimalNav.svelte';
	import { disciplineLabels } from '$lib/match-report';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const labels = disciplineLabels();
</script>

<svelte:head>
	<title>Rangliste {labels[data.board.category]} — TennisIndex</title>
	<meta
		name="description"
		content="Vereinsübergreifende TennisIndex-Rangliste im {labels[data.board.category]}."
	/>
</svelte:head>

<MinimalNav>
	<a class="btn btn-ghost" href="/">Start</a>
</MinimalNav>

<section class="sec sec-light">
	<div class="wrap" style="max-width: 720px">
		<div class="sec-head">
			<span class="eyebrow">TennisIndex</span>
			<h1>Rangliste — {labels[data.board.category]}</h1>
			<p class="muted">
				Die {data.board.players.length} bestplatzierten Spieler:innen über alle Vereine hinweg,
				sortiert nach Level. Ergebnis „belegt, nicht behauptet" — jedes Rating basiert auf
				bestätigten Matches.
			</p>
		</div>

		<div class="tabs" role="tablist" aria-label="Spielart">
			<a
				class="tab"
				class:active={data.board.category === 'singles'}
				href="/rankings/singles"
				role="tab"
				aria-selected={data.board.category === 'singles'}
			>
				{labels.singles}
			</a>
			<a
				class="tab"
				class:active={data.board.category === 'doubles'}
				href="/rankings/doubles"
				role="tab"
				aria-selected={data.board.category === 'doubles'}
			>
				{labels.doubles}
			</a>
		</div>

		{#if data.board.players.length === 0}
			<p class="empty">
				Noch keine gewerteten {labels[data.board.category]}-Matches — sei die/der Erste.
			</p>
		{:else}
			<ol class="board">
				{#each data.board.players as p (p.handle)}
					<li class="row">
						<a class="row-link" href="/p/{p.handle}" aria-label={p.name}></a>
							<span class="r">{p.rank}</span>
							<span class="who">
								<span class="nm">{p.name}</span>
								{#if !p.claimed}
									<span class="uc">unbeansprucht</span>
								{/if}
								<span class="club">
									<a class="club-link" href="/c/{p.clubSlug}">{p.clubName}</a>
									· {p.matches} Matches
								</span>
							</span>
							<span class="v">{p.rating.toFixed(2)}</span>
					</li>
				{/each}
			</ol>
		{/if}
	</div>
</section>

<style>
	.tabs {
		display: flex;
		gap: 8px;
		margin: 24px 0;
	}

	.tab {
		padding: 10px 20px;
		border-radius: 100px;
		border: 1px solid var(--line-light, rgba(0, 0, 0, 0.14));
		background: #fff;
		font-size: 14px;
		text-decoration: none;
		color: inherit;
	}

	.tab.active {
		background: var(--court, #8bc53f);
		border-color: var(--court, #8bc53f);
		color: #fff;
		font-weight: 600;
	}

	.empty {
		padding: 22px 0;
		color: var(--muted-light);
	}

	.board {
		list-style: none;
		margin: 0;
		padding: 0;
		border: 1px solid var(--line-light, rgba(0, 0, 0, 0.1));
		border-radius: 18px;
		overflow: hidden;
	}

	.board li + li {
		border-top: 1px solid var(--line-light, rgba(0, 0, 0, 0.08));
	}

	.row {
		position: relative;
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 12px 18px;
	}

	/* Deckt die ganze Zeile als Klickfläche ab, ohne ein <a> um den
	   Club-Link herum zu verschachteln (ungültiges HTML). Der Club-Link
	   selbst liegt mit z-index darüber und bleibt eigenständig klickbar. */
	.row-link {
		position: absolute;
		inset: 0;
	}

	.r {
		width: 28px;
		font-family: var(--mono);
		font-size: 13px;
		color: var(--muted-light);
	}

	.who {
		flex: 1;
		min-width: 0;
	}

	.nm {
		font-weight: 600;
	}

	.uc {
		margin-left: 7px;
		padding: 1px 6px;
		border-radius: 100px;
		font-family: var(--mono);
		font-size: 9px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted-light);
		border: 1px solid var(--line-light, rgba(0, 0, 0, 0.14));
	}

	.club {
		display: block;
		font-size: 12.5px;
		color: var(--muted-light);
	}

	.club-link {
		position: relative;
		z-index: 1;
		color: inherit;
	}

	.v {
		font-family: var(--mono);
		font-size: 16px;
		font-weight: 700;
	}
</style>
