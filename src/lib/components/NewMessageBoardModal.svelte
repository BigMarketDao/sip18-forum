<script lang="ts">
	import { getConfig } from '../stores/stores_config';
	import { createBoard, createThread, storedBnsData } from '../stores/threads';
	import {
		authenticate,
		getNewBoardTemplate,
		getStxAddress,
		openWalletForSignature,
		type Config
	} from '../utils/forum_helper';
	import { marked } from 'marked';
	import type { ForumMessageBoard } from 'sip18-forum-types';
	import { Profanity } from '@2toad/profanity';
	import { isConnected } from '@stacks/connect';

	const address = getStxAddress();
	export let config: Config;
	let template = getNewBoardTemplate(address, $storedBnsData);
	let showPreview = false;
	let error: string | null = null;
	let loading = false;
	let modalOpen = false;
	let componentKey = 0;

	const handleConnect = async () => {
		await authenticate();
		componentKey++;
	};

	async function handleSubmit() {
		error = null;
		if (!template.title.trim() || !template.content.trim()) {
			error = 'Title and content are required';
			return;
		}
		const profanity = new Profanity();
		template.title = profanity.censor(template.title);
		template.content = profanity.censor(template.content);
		try {
			loading = true;
			const { signature, publicKey } = await openWalletForSignature(getConfig(), template);
			await createBoard(config.VITE_FORUM_API, {
				forumContent: template,
				auth: { signature, publicKey }
			});
			// reset
			template = getNewBoardTemplate(address, $storedBnsData);
			modalOpen = false;
			if (typeof window !== undefined) {
				window.location.reload();
			}
		} catch (e: any) {
			error = e.message;
		} finally {
			loading = false;
		}
	}
</script>

<!-- Button to open modal -->
<div class="flex justify-center">
	<button class="btn variant-filled bg-primary-500" on:click={() => (modalOpen = true)}>
		New Board
	</button>
</div>

<!-- Modal -->
{#if modalOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/100">
		<div class="bg-base-100 w-full max-w-lg space-y-4 rounded-lg p-6 shadow-lg">
			<h2 class="text-xl font-bold">Create a New Message Board</h2>

			<input
				type="text"
				class="input input-bordered w-full"
				bind:value={template.title}
				placeholder="This message board title"
			/>

			<!-- Markdown Input -->
			<div class="space-y-2">
				<label for="content-entry" class="label font-semibold">Board Content</label>
				{#if !showPreview}
					<textarea
						id="content-entry"
						class="textarea textarea-bordered min-h-[120px] w-full"
						bind:value={template.content}
						placeholder="About this message board in Markdown…"
					></textarea>
				{:else}
					<div class="prose bg-base-100 border-base-300 max-w-none rounded border p-4">
						{@html marked(template.content)}
					</div>
				{/if}
				<button
					type="button"
					class="btn btn-sm btn-ghost mt-1"
					on:click={() => (showPreview = !showPreview)}
				>
					{showPreview ? 'Edit Markdown' : 'Preview Markdown'}
				</button>
			</div>

			{#if error}
				<p class="text-sm text-red-500">{error}</p>
			{/if}

			<div class="flex justify-end gap-2">
				<button class="btn" on:click={() => (modalOpen = false)} disabled={loading}>
					Cancel
				</button>
				{#key componentKey}
					{#if isConnected()}
						<button class="btn btn-primary" on:click={handleSubmit} disabled={loading}>
							{loading ? 'Posting…' : 'Create'}
						</button>
					{:else}
						<button class="btn btn-primary" on:click={handleConnect} disabled={loading}>
							Connect Wallet
						</button>
					{/if}
				{/key}
			</div>
		</div>
	</div>
{/if}
