<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let isDark = true;

	onMount(() => {});

	function toggleTheme() {
		isDark = !isDark;
		//localStorage.theme = isDark ? 'dark' : 'light';
		const current = document.documentElement.getAttribute('data-theme');
		const themeName = current === 'cerberus' ? 'sahara' : 'cerberus';
		//document.documentElement.setAttribute('data-theme', themeName);
		localStorage.setItem('theme', themeName);
		updateTheme(themeName);
	}

	function updateTheme(theme: 'sahara' | 'cerberus') {
		document.documentElement.setAttribute('data-theme', theme);
	}
</script>

<!-- {@render children()} -->
<button on:click={toggleTheme}>
	{isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
</button>
