import adapter from '@sveltejs/adapter-node';
import sveltePreprocess from 'svelte-preprocess';

const config = {
	preprocess: sveltePreprocess(),

	kit: {
		adapter: adapter(),
		alias: {
			$lib: './src/lib',
			$stores: './src/lib/stores',
			$types: './src/lib/types'
		}
	}
};

export default config;
