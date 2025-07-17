import { getNetworkFromUrl } from '$lib/stores/stores_config';
import { loadBoard, loadMessages } from '$lib/stores/threads';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, params }) => {
	const network = getNetworkFromUrl(url);
	const board = await loadBoard(params.forumId);
	const messages = await loadMessages(params.forumId);
	return { board, messages };
};
