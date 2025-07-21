<script lang="ts">
	import type {
		AuthenticatedForumContent,
		AuthenticatedForumMessageBoard
	} from 'sip18-forum-types';
	import Board from '$lib/components/Board.svelte';
	import { type Config } from '$lib/utils/forum_helper';
	import ThreadMessages from '$lib/components/Thread.svelte';
	import Thread from '$lib/components/Thread.svelte';

	export let data: {
		thread: AuthenticatedForumContent;
		appConfig: Config;
	};
	const thread = data.thread;
	//console.log('boards: ', thread);
</script>

<div class="container mx-auto max-w-3xl space-y-4 p-4">
	<Thread config={data.appConfig} {thread} />
</div>
