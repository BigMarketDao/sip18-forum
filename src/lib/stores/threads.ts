import { writable } from 'svelte/store';
import { getConfig } from './stores_config';
import type {
	AuthenticatedForumMessageBoard,
	ForumMessage,
	ForumMessageBoard,
	PostAuthorisation
} from 'sip18-forum-types';

export const storedBnsData = writable<string>();
export const storedBoard = writable<AuthenticatedForumMessageBoard>();
export const storedBoards = writable<AuthenticatedForumMessageBoard[]>([]);

export async function loadBoards(): Promise<Array<AuthenticatedForumMessageBoard>> {
	try {
		const res = await fetch(`${getConfig().VITE_BIGMARKET_API}/forum/boards`);
		if (!res.ok) throw new Error('Failed to load boards');
		const data = await res.json();
		return data;
	} catch (err) {
		console.error('Error loading threads:', err);
		return [];
	}
}

export async function loadBoard(
	messageBoardId: string
): Promise<AuthenticatedForumMessageBoard | undefined> {
	try {
		const res = await fetch(`${getConfig().VITE_BIGMARKET_API}/forum/board/${messageBoardId}`);
		if (!res.ok) throw new Error('Failed to load boards');
		const data = await res.json();
		return data;
	} catch (err) {
		console.error('Error loading threads:', err);
		return;
	}
}

export async function loadMessages(messageBoardId: string) {
	try {
		const res = await fetch(`${getConfig().VITE_BIGMARKET_API}/forum/messages/${messageBoardId}`);
		if (!res.ok) throw new Error('Failed to load messages');
		const data = await res.json();
		return data;
	} catch (err) {
		console.error('Error loading threads:', err);
	}
}

export async function createThread(payload: {
	forumContent: ForumMessage;
	auth: PostAuthorisation;
}) {
	const res = await fetch(`${getConfig().VITE_BIGMARKET_API}/forum/message`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	});
	if (!res.ok) throw new Error('Failed to create thread');

	return await loadMessages(payload.forumContent.messageBoardId); // refresh local store
}

export async function createBoard(payload: {
	forumContent: ForumMessageBoard;
	auth: PostAuthorisation;
}) {
	const res = await fetch(`${getConfig().VITE_BIGMARKET_API}/forum/board`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	});
	if (!res.ok) throw new Error('Failed to create thread');
	const data = await loadBoards(); // refresh local store
	storedBoards.set(data);
	if (data.length) storedBoard.set(data[0]);
}
