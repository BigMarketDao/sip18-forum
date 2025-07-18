<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import { browser } from '$app/environment';
	import AppBar from '$lib/components/theme/AppBar.svelte';
	import { configStore } from '$lib/stores/stores_config';
	import { isConnected } from '@stacks/connect';
	import { type Config, getBnsNameFromAddress, getStxAddress } from '$lib/utils/forum_helper';
	import { storedBnsData } from '$lib/stores/threads';

	export let data: {
		network: string;
		appConfig: Config;
	};
	if (!data.appConfig) throw new Error('no app config present?');
	$: configStore.set(data.appConfig);

	// let isDark = false;

	onMount(async () => {
		if (!browser) return;
		if (isConnected()) {
			const name = await getBnsNameFromAddress(data.appConfig.VITE_FORUM_API, getStxAddress());
			storedBnsData.set(name || getStxAddress());
		}
	});
</script>

<!-- {@render children()} -->
<div
	class="bg-surface-50-950 text-surface-contrast-50-950 from-surface-100-900
	       via-surface-100-900
	       to-surface-100-900 min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
	       font-extralight"
>
	<div class="">
		<div class="flex min-h-screen flex-col">
			<AppBar />
			<slot />
		</div>
	</div>
</div>
