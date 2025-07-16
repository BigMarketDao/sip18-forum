<script lang="ts">
	import type { AuthenticatedForumContent } from 'sip18-forum-types';
	import MessageCard from './MessageCard.svelte';
	import { onMount } from 'svelte';
	import { loadMessages } from '$lib/stores/threads';
	import NewMessageCard from './NewMessageCard.svelte';

	export let messageBoardId;
	export let level;
	let messages: Array<AuthenticatedForumContent>;

	const handleReload = async (data: any) => {
		messages = await loadMessages(messageBoardId);
	};

	onMount(async () => {
		messages = await loadMessages(messageBoardId);
	});
</script>

{#if level === 1}
	<NewMessageCard {messageBoardId} parentId={messageBoardId} onReload={handleReload} level={1} />
{/if}

<ul class="space-y-4">
	{#each messages as message}
		<MessageCard {message} onReload={handleReload} />
	{/each}
</ul>
