<script lang="ts">
	import type {
		AuthenticatedForumContent,
		AuthenticatedForumMessageBoard
	} from 'sip18-forum-types';
	import ForumMessages from './ForumMessages.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import type { Config } from '../utils/forum_helper';

	export let config: Config;
	export let boards: Array<AuthenticatedForumMessageBoard>;
	export let messages: Array<AuthenticatedForumContent>;
	let board: AuthenticatedForumMessageBoard | undefined;

	onMount(() => {
		const boardId = page.params.forumId;
		board = boards.find((o) => o.forumMessageBoard.messageBoardId === boardId);
	});
</script>

{#if board}
	<div class="space-y-6 p-6">
		<h1 class="text-2xl font-bold">📣 {board.forumMessageBoard.title}</h1>

		{#if board}
			<div
				class="text-surface-contrast-500 bg-primary-50-950 rounded-2xl border-1 border-dashed p-3 py-4 shadow"
			>
				<ForumMessages
					{config}
					{messages}
					messageBoardId={board.forumMessageBoard.messageBoardId}
					level={1}
				/>
			</div>
		{/if}
		<!-- <NewMessageBoardModal /> -->
	</div>
{:else}
	<div>loading...</div>
{/if}
