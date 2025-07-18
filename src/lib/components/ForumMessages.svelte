<script lang="ts">
	import type { AuthenticatedForumContent } from 'sip18-forum-types';
	import MessageCard from './MessageCard.svelte';
	import { onMount } from 'svelte';
	import { loadMessages } from '../stores/threads';
	import NewMessageCard from './NewMessageCard.svelte';
	import type { Config } from '../utils/forum_helper';

	export let config: Config;
	export let messageBoardId;
	export let messages: Array<AuthenticatedForumContent>;
	export let level;

	const handleReload = async (data: any) => {
		messages = await loadMessages(config.VITE_FORUM_API, messageBoardId);
	};

	onMount(async () => {});
</script>

{#if level === 1}
	<NewMessageCard
		{config}
		{messageBoardId}
		parentId={messageBoardId}
		onReload={handleReload}
		level={1}
	/>
{/if}

<ul class="space-y-4">
	{#each messages as message}
		<MessageCard {config} {message} onReload={handleReload} />
	{/each}
</ul>
