<script lang="ts">
	import { CircleUser, Wallet } from '@lucide/svelte';
	import {
		authenticate,
		getBnsNameFromAddress,
		getStxAddress,
		isLoggedIn,
		logUserOut
	} from '$lib/stacks/stacks-connect';
	import { storedBnsData } from '$lib/stores/threads';

	let componentKey = 0;

	const toggleAuth = async () => {
		if (isLoggedIn()) {
			logUserOut();
		} else {
			await authenticate();
			const name = await getBnsNameFromAddress(getStxAddress());
			storedBnsData.set(name || getStxAddress());
			window.location.reload();
		}
		componentKey++;
	};
</script>

<!-- {@render children()} -->

{#key componentKey}
	{#if isLoggedIn()}
		<button on:click={toggleAuth} class="btn bg-primary-800"
			><CircleUser class="mr-1 inline-block" size={20} /> {$storedBnsData}</button
		>
	{:else}
		<button on:click={toggleAuth}><Wallet size={20} /></button>
	{/if}
{/key}
