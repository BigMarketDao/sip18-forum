<script lang="ts">
	import type { AuthenticatedForumMessageBoard } from 'sip18-forum-types';
	import Boards from '$lib/components/Boards.svelte';
	import { boards } from '$lib/stores/threads';

	export let data: {
		boards: Array<AuthenticatedForumMessageBoard>;
	};
	boards.set(data.boards);
	console.log('boards: ', boards);
</script>

<div class="container mx-auto max-w-3xl space-y-4 p-4">
	<Boards />
</div>
