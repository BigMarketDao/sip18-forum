<script lang="ts">
	import type { AuthenticatedForumContent } from 'sip18-forum-types';
	import MessageCard from './MessageCard.svelte';
	import { onMount } from 'svelte';
	import { loadThread } from '../stores/threads';
	import type { Config } from '../utils/forum_helper';
	import { page } from '$app/state';

	export let config: Config;
	export let thread: AuthenticatedForumContent;

	const handleReload = async (data: any) => {
		thread = await loadThread(config.VITE_FORUM_API, page.params.threadId);
	};

	onMount(async () => {
		if (!thread) thread = await loadThread(config.VITE_FORUM_API, page.params.threadId);
	});
</script>

<MessageCard {config} message={thread} onReload={handleReload} />

<!-- <ul class="space-y-4">
	{#if thread.forumContent.replies?.length}
		{#each thread.forumContent.replies as message}
			<MessageCard {config} {message} onReload={handleReload} />
		{/each}
	{/if}
</ul> -->
