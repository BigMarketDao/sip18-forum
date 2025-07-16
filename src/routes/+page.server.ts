import { config, getNetworkFromUrl } from '$lib/stores/stores_config';
import { loadBoards } from '$lib/stores/threads';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const network = getNetworkFromUrl(url);
	const appConfig = config[network];
	console.log('appConfig: ', appConfig);

	// const path = `${appConfig.VITE_BIGMARKET_API}/forum/boards`;
	// console.log('getPredictionMarket ' + path);
	// const response = await fetch(path);
	// if (response.status === 404) return [];
	const boards = await loadBoards();
	console.log('getPredictionMarket ' + boards);
	return { boards };
};
