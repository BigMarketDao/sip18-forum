<script lang="ts">
	import type {
		AuthenticatedForumContent,
		AuthenticatedForumMessageBoard
	} from 'sip18-forum-types';
	import Board from '$lib/components/Board.svelte';

	export let data: {
		board: AuthenticatedForumMessageBoard;
		messages: Array<AuthenticatedForumContent>;
	};
	const board = data.board;
	const messages = data.messages;
	console.log('board: ', board);
	console.log('messages: ', messages);
</script>

<div class="container mx-auto max-w-3xl space-y-4 p-4">
	<Board {board} {messages} />
</div>
