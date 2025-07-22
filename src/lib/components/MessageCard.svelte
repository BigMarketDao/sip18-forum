<script lang="ts">
	import { marked } from 'marked';
	import type { AuthenticatedForumContent } from 'sip18-forum-types';
	import NewMessageCard from './NewMessageCard.svelte';
	import MessageCard from './MessageCard.svelte'; // self-import for recursion
	import { getPreferredLinkedAccount, verifyPost } from '../utils/forum_helper';
	import { onMount } from 'svelte';
	import { getBnsNameFromAddress, getStxAddress } from '../utils/forum_helper';
	import type { Config } from '../utils/forum_helper';
	import { ShieldCheck, StopCircle } from '@lucide/svelte';

	export let config: Config;
	// the first message IS the thread - this gets replaces by replies so we keep the main thread
	// for refreshing the tree.
	export let thread: AuthenticatedForumContent;
	export let message: AuthenticatedForumContent;
	export let onReload: (data: string) => void;

	let verified = false;
	let identifier: string;
	let displayName: string | undefined;
	const handleReload = async (data: any) => {
		onReload(data);
	};

	onMount(async () => {
		verified = verifyPost(config, message);
		const preferedAccount = getPreferredLinkedAccount(message.forumContent.linkedAccounts);
		identifier = preferedAccount?.identifier || getStxAddress();
		displayName = await getBnsNameFromAddress(config.VITE_FORUM_API, getStxAddress());
	});
</script>

<div
	class="card bg-surface-100-900 text-surface-contrast-100-900 mb-4 space-y-3 rounded-xl p-4 shadow ml-{message
		.forumContent.level * 1.5}"
>
	{#if message.forumContent.level === 1}
		<h2 class="text-primary-500 text-sm font-semibold">
			{message.forumContent.title}
		</h2>
	{/if}
	<h3 class="text-primary-500 text-xs font-semibold break-words">
		{#if verified}<ShieldCheck
				class="text-success-500 inline-block"
				width={15}
				height={15}
			/>{:else}<StopCircle class="text-error-700 inline-block" width={15} height={15} />{/if}
		{displayName || identifier}
	</h3>
	<div class="prose flex max-w-none flex-col gap-y-5 text-xs">
		{#if message.forumContent.title?.length}<div>{message.forumContent.title}</div>{/if}
		<div>{@html marked(message.forumContent.content)}</div>
	</div>

	<!-- 
		Optional reply form: messageBoardId is a container/board for messages. 
	 	Threads are top level messsages (level=1 and parentId=maessageBoardId).
	 	Messages and replies are identical - they are displayed recursively using level and parentId.
	-->
	<NewMessageCard
		{config}
		messageBoardId={message.forumContent.messageBoardId}
		parentId={message.forumContent.messageId}
		threadId={thread.forumContent.messageId}
		level={message.forumContent.level + 1}
		onReload={handleReload}
	/>

	<!-- Recursively render replies -->
	{#if message?.forumContent.replies?.length}
		<ul class="mt-4 space-y-4">
			{#each message.forumContent.replies as reply}
				<MessageCard {config} {thread} message={reply} onReload={handleReload} />
			{/each}
		</ul>
	{/if}
</div>
