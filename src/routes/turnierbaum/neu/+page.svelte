<script lang="ts">
	import { enhance } from '$app/forms';
	import LandingNav from '$lib/components/landing/LandingNav.svelte';
	import LandingFooter from '$lib/components/landing/LandingFooter.svelte';
	import { reveal } from '$lib/landing/reveal';
	import { mainNav } from '$lib/landing/nav';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let busy = $state(false);
</script>

<svelte:head>
	<title>Neuer Turnierbaum — TennisIndex</title>
	<meta name="robots" content="noindex, nofollow" />
	<meta name="theme-color" content="#0F1F13" />
</svelte:head>

<LandingNav links={mainNav()} />

<main>
	<section class="sec sec-light" id="top">
		<div class="wrap" style="max-width: 60ch">
			<span class="eyebrow" use:reveal>Turnierbaum</span>
			<h1 use:reveal={{ delay: 0.05 }}>Neuen Doppel-K.o.-Turnierbaum anlegen</h1>
			<p class="muted intro" use:reveal={{ delay: 0.1 }}>
				Für klassische Vereinsturniere mit Setzliste, Freilosen und doppelter Chance — eigenständig
				neben eurer Box-Liga. Teilnehmer:innen fügst du danach in der Verwaltung hinzu.
			</p>

			{#if form?.message}
				<p class="warn" role="alert">{form.message}</p>
			{/if}

			<form
				method="POST"
				use:enhance={() => {
					busy = true;
					return async ({ update }) => {
						await update();
						busy = false;
					};
				}}
			>
				<fieldset disabled={busy}>
					<label class="field-label" for="clubId">Verein</label>
					<select id="clubId" name="clubId" required>
						{#each data.clubs as c (c.id)}
							<option value={c.id}>{c.name}</option>
						{/each}
					</select>

					<label class="field-label" for="name">Name</label>
					<input id="name" name="name" placeholder="z. B. Vereinsmeisterschaft 2026" required />

					<label class="field-label" for="slug">Slug (Teil der URL)</label>
					<input
						id="slug"
						name="slug"
						placeholder="z. B. vereinsmeisterschaft-2026"
						pattern="[a-z0-9]+(-[a-z0-9]+)*"
						required
					/>

					<label class="field-label" for="category">Spielart</label>
					<select id="category" name="category">
						<option value="singles">Einzel</option>
						<option value="doubles">Doppel</option>
					</select>

					<button class="btn btn-primary" type="submit" style="margin-top: 20px">
						{busy ? 'Wird angelegt …' : 'Turnierbaum anlegen'}
					</button>
				</fieldset>
			</form>
		</div>
	</section>
</main>

<LandingFooter />

<style>
	h1 {
		margin-top: 18px;
	}
	.intro {
		margin-top: 14px;
		margin-bottom: 28px;
	}
	.warn {
		margin-bottom: 20px;
		padding: 12px 16px;
		border-radius: 12px;
		font-size: 14px;
		background: rgba(193, 122, 84, 0.1);
		color: #8f3419;
	}
	fieldset {
		border: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
	}
	.field-label {
		font-size: 13px;
		font-weight: 600;
		margin: 16px 0 6px;
	}
	.field-label:first-of-type {
		margin-top: 0;
	}
	input,
	select {
		padding: 10px 12px;
		border: 1px solid var(--line-light);
		border-radius: 10px;
		font-size: 14px;
		background: #fff;
		color: var(--ink);
		font-family: inherit;
	}
</style>
