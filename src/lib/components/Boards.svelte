<script lang="ts">
	import NewMessageBoardModal from './NewMessageBoardModal.svelte';
	import { boards } from '$lib/stores/threads';
	import ForumMessages from './ForumMessages.svelte';
</script>

<div class="space-y-6 p-6">
	<h1 class="text-2xl font-bold">📣 All Community Message Board</h1>

	{#each $boards as board}
		<div
			class="text-surface-contrast-500 bg-primary-50-950 rounded-2xl border-1 border-dashed p-3 py-4 shadow"
		>
			<div class=" mb-5 justify-between">
				<h2 class="text-xl font-semibold">{board.forumMessageBoard.title}</h2>
				<!-- <pre class="text-secondary-200-800">{board.forumMessageBoard.content}</pre> -->
			</div>
			<ForumMessages messageBoardId={board.forumMessageBoard.messageBoardId} level={1} />
		</div>
	{/each}
	<NewMessageBoardModal />
</div>
