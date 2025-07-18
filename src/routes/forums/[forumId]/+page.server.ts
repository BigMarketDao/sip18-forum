import { loadBoards } from '$lib';
import { config } from '$lib/stores/stores_config';
import { getNetworkFromUrl } from '$lib/stores/stores_config';
import { loadBoard, loadMessages } from '$lib/stores/threads';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, params }) => {
	const network = getNetworkFromUrl(url);
	const appConfig = config[network];
	const boards = await loadBoards(appConfig.VITE_FORUM_API);
	const messages = await loadMessages(appConfig.VITE_FORUM_API, params.forumId);
	return { appConfig, boards, messages, boardId: params.forumId };
};
