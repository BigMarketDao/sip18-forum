<script lang="ts">
	import { CircleUser, Wallet } from '@lucide/svelte';
	import { isLoggedIn, logUserOut } from '../../utils/signer';
	import { storedBnsData } from '../../stores/threads';
	import { getConfig } from '../../stores/stores_config';
	import { authenticate, getBnsNameFromAddress, getStxAddress } from '../../utils/forum_helper';

	let componentKey = 0;

	const toggleAuth = async () => {
		if (isLoggedIn()) {
			logUserOut();
		} else {
			await authenticate();
			const name = await getBnsNameFromAddress(getConfig().VITE_FORUM_API, getStxAddress());
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
