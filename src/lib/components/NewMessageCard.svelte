<script lang="ts">
	import { createThread, storedBnsData } from '../stores/threads';
	import {
		openWalletForSignature,
		getNewMessageTemplate,
		type Config,
		getStxAddress,
		authenticate
	} from '../utils/forum_helper';
	import { Profanity } from '@2toad/profanity';
	import { isConnected } from '@stacks/connect';
	import { marked } from 'marked';

	export let config: Config;
	export let messageBoardId: string;
	export let parentId: string;
	export let level: number;
	export let onReload: (data: string) => void;
	const address = getStxAddress();
	let template = getNewMessageTemplate(messageBoardId, parentId, address, 1, $storedBnsData);
	let showPreview = false;
	let error: string | null = null;
	let loading = false;
	let composerOpen = false;
	let componentKey = 0;

	const handleConnect = async () => {
		await authenticate();
		componentKey++;
	};

	async function handleSubmit() {
		error = null;
		if (!template.content.trim()) {
			error = 'Content are required';
			return;
		}
		if (!template.title.trim() && level === 1) {
			error = 'Title required on top level message';
			return;
		}
		const profanity = new Profanity();
		template.title = profanity.censor(template.title);
		template.content = profanity.censor(template.content);

		try {
			loading = true;
			const { signature, publicKey } = await openWalletForSignature(config, template);
			const thread = await createThread(config.VITE_FORUM_API, {
				forumContent: template,
				auth: { signature, publicKey }
			});
			template = getNewMessageTemplate(messageBoardId, parentId, address, level, $storedBnsData);
			composerOpen = false;
			onReload(thread);
		} catch (e: any) {
			error = e.message;
		} finally {
			loading = false;
		}
	}
</script>

<!-- Toggle Button -->
{#if !composerOpen}
	<div class="my-5 flex justify-end">
		<a
			class="text-secondary-100 text-sm"
			href="/"
			on:click|preventDefault={() => (composerOpen = !composerOpen)}
		>
			new thread
		</a>
	</div>
{/if}

<!-- Composer Card -->
{#if composerOpen}
	<div
		class="card bg-surface-100 dark:bg-surface-800 border-base-300 space-y-4 rounded-xl border p-6 shadow-lg"
	>
		<h2 class="text-xl font-bold">Create New Message</h2>

		{#if level === 1}
			<input
				type="text"
				placeholder="Thread title"
				class="input input-bordered w-full"
				bind:value={template.title}
			/>
		{/if}

		<!-- Markdown Content Area -->
		<div class="space-y-2">
			<label for="content-entry" class="label font-semibold">Content</label>
			{#if !showPreview}
				<textarea
					id="content-entry"
					class="textarea textarea-bordered min-h-[120px] w-full"
					bind:value={template.content}
					placeholder="Write your post in Markdown…"
				></textarea>
			{:else}
				<div class="prose bg-base-100 border-base-300 max-w-none rounded border p-4">
					{@html marked(template.content)}
				</div>
			{/if}
			<button
				type="button"
				class="btn btn-sm btn-ghost"
				on:click={() => (showPreview = !showPreview)}
			>
				{showPreview ? 'Edit Markdown' : 'Preview Markdown'}
			</button>
		</div>

		{#if error}
			<p class="text-sm text-red-500">{error}</p>
		{/if}

		<!-- Action Buttons -->
		<div class="flex justify-end gap-2">
			{#key componentKey}
				{#if isConnected()}
					<div class="flex gap-x-3">
						<button class="btn bg-tertiary-500" on:click={() => (composerOpen = !composerOpen)}>
							{composerOpen ? 'Cancel' : 'New Message'}
						</button>
						<button class="btn bg-primary-500" on:click={handleSubmit} disabled={loading}>
							{loading ? 'Posting…' : 'Post'}
						</button>
					</div>
				{:else}
					<button type="button" class="btn btn-primary" on:click={handleConnect} disabled={loading}>
						Connect Wallet
					</button>
				{/if}
			{/key}
		</div>
	</div>
{/if}
