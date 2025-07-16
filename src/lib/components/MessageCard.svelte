<script lang="ts">
	import { marked } from 'marked';
	import type { AuthenticatedForumContent } from 'sip18-forum-types';
	import NewMessageCard from './NewMessageCard.svelte';
	import MessageCard from './MessageCard.svelte'; // self-import for recursion

	export let message: AuthenticatedForumContent;
	export let onReload: (data: string) => void;

	const handleReload = async (data: any) => {
		onReload(data);
	};
</script>

<div
	class="card bg-surface-100-900 text-surface-contrast-100-900 mb-4 space-y-3 rounded-xl p-4 shadow ml-{message
		.forumContent.level * 1.5}"
>
	<h3 class="text-primary-500 text-lg font-semibold">{message.forumContent.title}</h3>
	<div class="prose max-w-none text-sm">
		{@html marked(message.forumContent.content)}
	</div>

	<!-- Optional reply form -->
	<NewMessageCard
		messageBoardId={message.forumContent.messageBoardId}
		parentId={message.forumContent.messageId}
		level={message.forumContent.level + 1}
		onReload={handleReload}
	/>

	<!-- Recursively render replies -->
	{#if message.forumContent.replies?.length}
		<ul class="mt-4 space-y-4">
			{#each message.forumContent.replies as reply}
				<MessageCard message={reply} onReload={handleReload} />
			{/each}
		</ul>
	{/if}
</div>
