<script lang="ts">
	import { enhance } from '$app/forms';
	import LandingNav from '$lib/components/landing/LandingNav.svelte';
	import LandingFooter from '$lib/components/landing/LandingFooter.svelte';
	import { reveal } from '$lib/landing/reveal';
	import { mainNav } from '$lib/landing/nav';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let busy = $state(false);
	let openReport = $state<string | null>(null);
	let walkoverFor = $state<Record<string, boolean>>({});

	const statusLabel: Record<string, string> = {
		pending: 'wartet auf Auslosung',
		scheduled: 'offen',
		bye: 'Freilos',
		walkover: 'kampflos',
		played: 'gespielt'
	};

	const openMatches = $derived(data.matches.filter((m) => m.status === 'scheduled'));
	const otherMatches = $derived(data.matches.filter((m) => m.status !== 'scheduled'));
</script>

<svelte:head>
	<title>Turnierbaum verwalten — {data.event.name} — TennisIndex</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<LandingNav links={mainNav()} />

<main>
	<section class="sec sec-light" id="top">
		<div class="wrap" style="max-width: 76ch">
			<span class="eyebrow" use:reveal>Turnierbaum-Verwaltung</span>
			<h1 use:reveal={{ delay: 0.05 }}>{data.event.name}</h1>
			<p class="muted" use:reveal={{ delay: 0.1 }}>
				{data.event.category === 'doubles' ? 'Doppel' : 'Einzel'} · Status: {data.event.status}
				· <a href="/turnierbaum/{data.event.slug}">Öffentliche Ansicht →</a>
			</p>

			{#if form?.message}
				<p class="warn" role="alert">{form.message}</p>
			{/if}
			{#if form?.success}
				<p class="ok" role="status">Gespeichert.</p>
			{/if}

			{#if data.event.status === 'draft'}
				<section class="card" use:reveal>
					<h2 class="card-title">Teilnehmer:innen ({data.participants.length})</h2>
					{#if data.participants.length === 0}
						<p class="muted small">Noch niemand gemeldet.</p>
					{:else}
						<ol class="participants">
							{#each data.participants as p (p.id)}
								<li>
									<span class="seed num">#{p.seed}</span>
									<span>{p.displayName}</span>
									<form
										method="POST"
										action="?/removeParticipant"
										use:enhance={() => {
											busy = true;
											return async ({ update }) => {
												await update();
												busy = false;
											};
										}}
									>
										<input type="hidden" name="participantId" value={p.id} />
										<button class="btn btn-ghost-light small" type="submit" disabled={busy}
											>entfernen</button
										>
									</form>
								</li>
							{/each}
						</ol>
					{/if}

					<form
						method="POST"
						action="?/shuffle"
						style="margin-top: 14px"
						use:enhance={() => {
							busy = true;
							return async ({ update }) => {
								await update();
								busy = false;
							};
						}}
					>
						<button class="btn btn-ghost-light small" type="submit" disabled={busy}
							>Setzliste mischen</button
						>
					</form>
				</section>

				<section class="card" use:reveal={{ delay: 0.05 }}>
					<h2 class="card-title">Person hinzufügen</h2>
					{#if data.availableMembers.length === 0}
						<p class="muted small">Alle Vereinsmitglieder sind schon gemeldet.</p>
					{:else}
						<form
							method="POST"
							action="?/addParticipant"
							use:enhance={() => {
								busy = true;
								return async ({ update }) => {
									await update();
									busy = false;
								};
							}}
						>
							<label class="field-label" for="playerId1">Spieler:in</label>
							<select id="playerId1" name="playerId1" required>
								{#each data.availableMembers as m (m.playerId)}
									<option value={m.playerId}>{m.name}</option>
								{/each}
							</select>

							{#if data.event.category === 'doubles'}
								<label class="field-label" for="playerId2">Partner:in</label>
								<select id="playerId2" name="playerId2" required>
									{#each data.availableMembers as m (m.playerId)}
										<option value={m.playerId}>{m.name}</option>
									{/each}
								</select>
							{/if}

							<button class="btn btn-primary" type="submit" style="margin-top: 14px" disabled={busy}
								>Hinzufügen</button
							>
						</form>
					{/if}
				</section>

				<section class="card" use:reveal={{ delay: 0.1 }}>
					<h2 class="card-title">Auslosung starten</h2>
					<p class="muted small">
						Mindestens 4 Teilnehmer:innen nötig. Danach lässt sich die Teilnehmer:innenliste nicht
						mehr ändern.
					</p>
					<form
						method="POST"
						action="?/startDraw"
						use:enhance={() => {
							busy = true;
							return async ({ update }) => {
								await update();
								busy = false;
							};
						}}
					>
						<button
							class="btn btn-primary"
							type="submit"
							disabled={busy || data.participants.length < 4}
						>
							Auslosung starten ({data.participants.length} Teilnehmer:innen)
						</button>
					</form>
				</section>
			{:else}
				<section class="card" use:reveal>
					<h2 class="card-title">Offene Partien ({openMatches.length})</h2>
					{#if openMatches.length === 0}
						<p class="muted small">Aktuell nichts zu melden.</p>
					{:else}
						<ul class="matches">
							{#each openMatches as m (m.id)}
								<li class="match">
									<p class="pairing">
										<strong>{m.entry1?.displayName}</strong>
										<em>vs.</em>
										<strong>{m.entry2?.displayName}</strong>
									</p>
									<button
										class="btn btn-ghost-light small"
										type="button"
										onclick={() => (openReport = openReport === m.id ? null : m.id)}
									>
										Ergebnis eintragen
									</button>

									{#if openReport === m.id}
										<form
											method="POST"
											action="?/report"
											class="report-form"
											use:enhance={() => {
												busy = true;
												return async ({ update }) => {
													await update();
													busy = false;
													openReport = null;
												};
											}}
										>
											<input type="hidden" name="bracketMatchId" value={m.id} />

											<label class="check">
												<input
													type="checkbox"
													checked={walkoverFor[m.id] ?? false}
													onchange={(e) =>
														(walkoverFor[m.id] = (e.target as HTMLInputElement).checked)}
												/>
												kampflos (kein echtes Spiel, kein Rating-Effekt)
											</label>
											<input type="hidden" name="isWalkover" value={walkoverFor[m.id] ? 'true' : 'false'} />

											{#if !walkoverFor[m.id]}
												<div class="sets">
													{#each [1, 2, 3, 4, 5] as i (i)}
														<div class="set-row">
															<span class="num">Satz {i}</span>
															<input
																type="number"
																name="set{i}team1"
																min="0"
																max="99"
																placeholder="{m.entry1?.displayName}"
															/>
															<span>:</span>
															<input
																type="number"
																name="set{i}team2"
																min="0"
																max="99"
																placeholder="{m.entry2?.displayName}"
															/>
														</div>
													{/each}
												</div>
											{/if}

											<label class="field-label" for="winnerSide-{m.id}">Sieger:in</label>
											<select id="winnerSide-{m.id}" name="winnerSide" required>
												<option value="1">{m.entry1?.displayName}</option>
												<option value="2">{m.entry2?.displayName}</option>
											</select>

											<button
												class="btn btn-primary small"
												type="submit"
												style="margin-top: 10px"
												disabled={busy}>Speichern</button
											>
										</form>
									{/if}
								</li>
							{/each}
						</ul>
					{/if}
				</section>

				<section class="card" use:reveal={{ delay: 0.05 }}>
					<h2 class="card-title">Alle Partien</h2>
					<ul class="matches compact">
						{#each otherMatches as m (m.id)}
							<li>
								<span class="pill">{statusLabel[m.status]}</span>
								{m.entry1?.displayName ?? '—'} <em>vs.</em> {m.entry2?.displayName ?? '—'}
							</li>
						{/each}
					</ul>
				</section>
			{/if}
		</div>
	</section>
</main>

<LandingFooter />

<style>
	h1 {
		margin-top: 18px;
	}
	.warn {
		margin: 16px 0;
		padding: 12px 16px;
		border-radius: 12px;
		font-size: 14px;
		background: rgba(193, 122, 84, 0.1);
		color: #8f3419;
	}
	.ok {
		margin: 16px 0;
		padding: 10px 16px;
		border-radius: 12px;
		font-size: 14px;
		background: rgba(76, 122, 31, 0.1);
		color: #3c5d18;
	}
	.card {
		margin-top: 24px;
		padding: 20px;
		border: 1px solid var(--line-light, rgba(0, 0, 0, 0.14));
		border-radius: 14px;
		background: #fff;
	}
	.card-title {
		margin: 0 0 12px;
		font-size: 16px;
	}
	.small {
		font-size: 13px;
	}
	.participants {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.participants li {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.seed {
		color: var(--muted-light);
		font-size: 12px;
		min-width: 26px;
	}
	.field-label {
		display: block;
		font-size: 13px;
		font-weight: 600;
		margin: 14px 0 6px;
	}
	select,
	input[type='number'] {
		padding: 8px 10px;
		border: 1px solid var(--line-light, rgba(0, 0, 0, 0.14));
		border-radius: 10px;
		font-size: 14px;
		background: #fff;
		color: var(--ink);
		font-family: inherit;
	}
	.matches {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.matches.compact {
		gap: 8px;
		font-size: 13px;
		color: var(--muted-light);
	}
	.match {
		padding: 12px;
		border: 1px solid var(--line-light, rgba(0, 0, 0, 0.14));
		border-radius: 10px;
	}
	.pairing {
		margin: 0 0 8px;
	}
	.report-form {
		margin-top: 12px;
		padding-top: 12px;
		border-top: 1px solid var(--line-light, rgba(0, 0, 0, 0.14));
		display: flex;
		flex-direction: column;
	}
	.check {
		font-size: 13px;
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.sets {
		margin-top: 10px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.set-row {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.set-row input {
		width: 60px;
	}
	.pill {
		display: inline-block;
		margin-right: 8px;
		padding: 2px 9px;
		border-radius: 100px;
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--muted-light);
		border: 1px solid var(--line-light, rgba(0, 0, 0, 0.14));
	}
</style>
