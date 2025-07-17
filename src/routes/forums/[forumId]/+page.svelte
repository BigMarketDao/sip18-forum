<script lang="ts">
	import type {
		AuthenticatedForumContent,
		AuthenticatedForumMessageBoard
	} from 'sip18-forum-types';
	import Board from '$lib/components/Board.svelte';

	export let data: {
		boards: Array<AuthenticatedForumMessageBoard>;
		messages: Array<AuthenticatedForumContent>;
	};
	const boards = data.boards;
	const messages = data.messages;
	console.log('boards: ', boards);
</script>

<div class="container mx-auto max-w-3xl space-y-4 p-4">
	<Board {boards} {messages} />
</div>
