<script lang="ts">
	import type { AuthenticatedForumMessageBoard } from 'sip18-forum-types';
	import Boards from '$lib/components/Boards.svelte';
	import { storedBoards } from '$lib/stores/threads';
	import { onMount } from 'svelte';
	import { type Config } from '$lib/utils/forum_helper';

	export let data: {
		boards: Array<AuthenticatedForumMessageBoard>;
		appConfig: Config;
	};
	let inited = false;
	storedBoards.set(data.boards);
	console.log('boards: ', data.appConfig);

	onMount(() => {
		//if (typeof window !== undefined && data.boards.length)
		//window.location.replace(`/forums/${data.boards[0].forumMessageBoard.messageBoardId}`);
		console.log('data.boards: ', data.boards);
		inited = true;
	});
</script>

<div class="container mx-auto max-w-3xl space-y-4 p-4">
	{#if inited}
		<Boards config={data.appConfig} />
	{/if}
</div>
