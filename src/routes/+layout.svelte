<script lang="ts">
	import { configStore, type Config } from '$lib/stores/stores_config';
	import { onMount } from 'svelte';
	import '../app.css';
	import { browser } from '$app/environment';
	import ThemeToggle from '$lib/components/theme/ThemeToggle.svelte';
	// let { children } = $props();

	export let data: {
		network: string;
		appConfig: Config;
	};
	if (!data.appConfig) throw new Error('no app config present?');
	$: configStore.set(data.appConfig);

	// let isDark = false;

	onMount(() => {
		if (!browser) return;
		// isDark = localStorage.theme === 'dark';
		// const html = document.documentElement;
		// if (isDark) {
		// 	html.classList.add('dark');
		// } else {
		// 	html.classList.remove('dark');
		// }
	});
</script>

<!-- {@render children()} -->
<div
	class="bg-surface-50-950 text-surface-contrast-50-950 from-surface-100-900
	       via-surface-100-900
	       to-surface-100-900 min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
	       font-extralight"
>
	<div class="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
		<div class="flex min-h-screen flex-col">
			<slot />
			<ThemeToggle />
		</div>
	</div>
</div>
