import { writable } from 'svelte/store';
import type {
	AuthenticatedForumMessageBoard,
	ForumMessage,
	ForumMessageBoard,
	PostAuthorisation
} from 'sip18-forum-types';

export const storedBnsData = writable<string>();
export const storedBoard = writable<AuthenticatedForumMessageBoard>();
export const storedBoards = writable<AuthenticatedForumMessageBoard[]>([]);

export async function loadBoards(api: string): Promise<Array<AuthenticatedForumMessageBoard>> {
	try {
		const res = await fetch(`${api}/forum/boards`);
		if (!res.ok) throw new Error('Failed to load boards');
		const data = await res.json();
		return data;
	} catch (err) {
		console.error('Error loading threads:', err);
		return [];
	}
}

export async function loadBoard(
	api: string,
	messageBoardId: string
): Promise<AuthenticatedForumMessageBoard | undefined> {
	try {
		const res = await fetch(`${api}/forum/board/${messageBoardId}`);
		if (!res.ok) throw new Error('Failed to load boards');
		const data = await res.json();
		return data;
	} catch (err) {
		console.error('Error loading threads:', err);
		return;
	}
}

export async function loadMessages(api: string, messageBoardId: string) {
	try {
		const res = await fetch(`${api}/forum/messages/${messageBoardId}`);
		if (!res.ok) throw new Error('Failed to load messages');
		const data = await res.json();
		return data;
	} catch (err) {
		console.error('Error loading threads:', err);
	}
}

export async function createThread(
	api: string,
	payload: {
		forumContent: ForumMessage;
		auth: PostAuthorisation;
	}
) {
	const res = await fetch(`${api}/forum/message`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	});
	if (!res.ok) throw new Error('Failed to create thread');

	return await loadMessages(api, payload.forumContent.messageBoardId); // refresh local store
}

export async function createBoard(
	api: string,
	payload: {
		forumContent: ForumMessageBoard;
		auth: PostAuthorisation;
	}
) {
	const res = await fetch(`${api}/forum/board`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	});
	if (!res.ok) throw new Error('Failed to create thread');
	const data = await loadBoards(api); // refresh local store
	storedBoards.set(data);
	if (data.length) storedBoard.set(data[0]);
}
