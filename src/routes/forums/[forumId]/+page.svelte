<script lang="ts">
	import type {
		AuthenticatedForumContent,
		AuthenticatedForumMessageBoard
	} from 'sip18-forum-types';
	import Board from '$lib/components/Board.svelte';
	import { type Config } from '$lib/utils/forum_helper';

	export let data: {
		boards: Array<AuthenticatedForumMessageBoard>;
		messages: Array<AuthenticatedForumContent>;
		appConfig: Config;
	};
	const boards = data.boards;
	const messages = data.messages;
	console.log('boards: ', boards);
</script>

<div class="container mx-auto max-w-3xl space-y-4 p-4">
	<Board config={data.appConfig} {boards} {messages} />
</div>
