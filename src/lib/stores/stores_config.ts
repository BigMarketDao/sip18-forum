import { get } from 'svelte/store';
import { writable } from 'svelte/store';

export function switchConfig(env: string) {
	configStore.set(config[env]);
}

export function getConfig(): Config {
	return get(configStore);
}

export function getNetworkFromUrl(url: URL): string {
	const chain = url.searchParams.get('chain');
	return chain && ['mainnet', 'testnet', 'devnet'].includes(chain) ? chain : 'devnet';
}

export interface Config {
	VITE_PUBLIC_APP_NAME: string;
	VITE_PUBLIC_APP_VERSION: string;
	VITE_NETWORK: string;
	VITE_BIGMARKET_API: string;
	VITE_STACKS_API: string;
}

export const config: { [key: string]: Config } = {
	devnet: {
		VITE_PUBLIC_APP_NAME: 'BigMarket',
		VITE_PUBLIC_APP_VERSION: '1.0.0',
		VITE_NETWORK: 'devnet',
		VITE_BIGMARKET_API: 'http://localhost:3025/bigmarket-api',
		VITE_STACKS_API: 'http://localhost:3999'
	},
	testnet: {
		VITE_PUBLIC_APP_NAME: 'BigMarket',
		VITE_PUBLIC_APP_VERSION: '1.0.0',
		VITE_NETWORK: 'testnet',
		VITE_BIGMARKET_API: 'https://api.testnet.bigmarket.ai/bigmarket-api',
		VITE_STACKS_API: 'https://api.testnet.hiro.so'
	},
	mainnet: {
		VITE_PUBLIC_APP_NAME: 'BigMarket',
		VITE_PUBLIC_APP_VERSION: '1.0.0',
		VITE_NETWORK: 'mainnet',
		VITE_BIGMARKET_API: 'https://api.bigmarket.ai/bigmarket-api',
		VITE_STACKS_API: 'https://api.hiro.so'
	}
};
const initialConfig = config.testnet;
export let configStore = writable(initialConfig);
