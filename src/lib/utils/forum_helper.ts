import { bytesToHex, hexToBytes } from '@stacks/common';
import { sha256 } from '@noble/hashes/sha256';
import { request } from '@stacks/connect';
import { ChainId } from '@stacks/network';
import { getConfig, type Config } from '$lib/stores/stores_config.js';
import {
	encodeStructuredDataBytes,
	publicKeyFromSignatureRsv,
	publicKeyToAddressSingleSig,
	stringAsciiCV,
	tupleCV,
	uintCV,
	verifySignature,
	type ClarityValue,
	type TupleCV,
	type TupleData
} from '@stacks/transactions';
import type {
	ForumMessage,
	BaseForumContent,
	LinkedAccount,
	PostAuthorisation,
	ForumMessageBoard,
	AuthenticatedForumContent
} from 'sip18-forum-types';

export function getNewBoardTemplate(stxAddress: string, bnsName: string): ForumMessageBoard {
	const created = new Date().getTime();
	const messageBoardId = crypto.randomUUID();
	const forumMessageBoard: ForumMessageBoard = {
		messageBoardId,
		linkedAccounts: [getDefaultStacksLinkedAccount(stxAddress, bnsName)],
		owner: stxAddress,
		title: '',
		content: '',
		created,
		deleted: false
	};
	return forumMessageBoard;
}
export function getNewMessageTemplate(
	messageBoardId: string,
	parentId: string,
	stxAddress: string,
	level: number,
	bnsName: string
): ForumMessage {
	const forumMessage: ForumMessage = {
		messageBoardId,
		parentId,
		messageId: crypto.randomUUID(),
		linkedAccounts: [getDefaultStacksLinkedAccount(stxAddress, bnsName)],
		title: '',
		content: '',
		created: new Date().getTime(),
		deleted: false,
		level
	};
	return forumMessage;
}

export function getDefaultStacksLinkedAccount(stxAddress: string, bnsName: string): LinkedAccount {
	const linkedAccount: LinkedAccount = {
		source: 'stacks',
		identifier: stxAddress,
		verified: true,
		preferred: true,
		displayName: bnsName
	};
	return linkedAccount;
}
export function getPreferredLinkedAccount(
	linkedAccounts: Array<LinkedAccount>
): LinkedAccount | undefined {
	return linkedAccounts.find((o) => o.preferred);
}

export async function openWalletForSignature(appConfig: Config, message: BaseForumContent) {
	return await request('stx_signStructuredMessage', {
		message: forumMessageToTupleCV(message),
		domain: domainCV(getDomain(appConfig))
	});
}

export function verifyPost(wrapper: AuthenticatedForumContent) {
	try {
		const la = getPreferredLinkedAccount(wrapper.forumContent.linkedAccounts);
		if (!la) return false;
		const stxAddressFromKey = getC32AddressFromPublicKey(
			wrapper.auth.publicKey,
			getConfig().VITE_NETWORK
		);
		if (la.identifier !== stxAddressFromKey) {
			console.log('/polls: wrong voter: ' + la.identifier + ' signer: ' + stxAddressFromKey);
			return false;
		}
		const forumPostCV = forumMessageToTupleCV(wrapper.forumContent);

		let valid = verifyForumSignature(
			getConfig().VITE_NETWORK,
			getConfig().VITE_PUBLIC_APP_NAME,
			getConfig().VITE_PUBLIC_APP_VERSION,
			forumPostCV,
			wrapper.auth.publicKey,
			wrapper.auth.signature
		);

		if (!valid) {
			console.warn('Signature verification failed');
			return false;
		}

		return true;
	} catch (err: any) {
		console.error('Post verification error:', err);
		throw new Error(`Post verification failed: ${err.message}`);
	}
}

export function getDomain(appConfig: Config) {
	const chainId = appConfig.VITE_NETWORK === 'mainnet' ? ChainId.Mainnet : ChainId.Testnet;
	console.log(chainId);
	return {
		name: appConfig.VITE_PUBLIC_APP_NAME,
		version: appConfig.VITE_PUBLIC_APP_VERSION,
		'chain-id': chainId
	};
}

export function domainCV(domain: any) {
	return tupleCV({
		name: stringAsciiCV(domain.name),
		version: stringAsciiCV(domain.version),
		'chain-id': uintCV(domain['chain-id'])
	});
}

// SIP-018 domain (must match client signing)
const domain = {
	name: 'BigMarket Forum',
	version: '1.0.0',
	chainId: 1
};

function getC32AddressFromPublicKey(publicKeyHex: string, network: string): string {
	//console.log("getC32AddressFromPublicKey: auth check");

	if (network === 'mainnet' || network === 'testnet' || network === 'devnet') {
		const stacksAddress = publicKeyToAddressSingleSig(publicKeyHex, network);
		return stacksAddress;
	}
	return 'unknown';
}

function forumMessageToTupleCV(message: BaseForumContent): TupleCV<TupleData<ClarityValue>> {
	const la = getPreferredLinkedAccount(message.linkedAccounts);
	if (!la) throw new Error('Unable to convert this message');
	return tupleCV({
		identifier: stringAsciiCV(la.identifier),
		created: uintCV(message.created),
		title: stringAsciiCV(message.title),
		content: stringAsciiCV(message.content),
		name: stringAsciiCV(la.displayName || 'unknown')
	});
}

function verifyForumSignature(
	network: string,
	appName: string,
	appVersion: string,
	message: TupleCV<TupleData<ClarityValue>>,
	publicKey: string,
	signature: string
): string | undefined {
	const chainId = network === 'mainnet' ? ChainId.Mainnet : ChainId.Testnet;
	const domain = tupleCV({
		name: stringAsciiCV(appName),
		version: stringAsciiCV(appVersion),
		'chain-id': uintCV(chainId)
	});
	const structuredDataHash = bytesToHex(sha256(encodeStructuredDataBytes({ message, domain })));

	//console.log("signature.hash: " + structuredDataHash);

	const signatureBytes = hexToBytes(signature);
	const strippedSignature = signatureBytes.slice(0, -1);
	//console.log("Stripped Signature (Hex):", bytesToHex(strippedSignature));

	let pubkey: string = '-';
	let stacksAddress: string = '-';
	try {
		pubkey = publicKeyFromSignatureRsv(structuredDataHash, signature);

		if (network === 'mainnet' || network === 'testnet' || network === 'devnet') {
			stacksAddress = publicKeyToAddressSingleSig(pubkey, network);
		}

		//console.log("sa: " + pubkey);
	} catch (err: any) {}
	//console.log("pubkey: " + pubkey);
	let result = false;
	try {
		result = verifySignature(bytesToHex(strippedSignature), structuredDataHash, publicKey);
		//console.log("verifySignatureRsv: result: " + result);
	} catch (err: any) {}
	return result ? stacksAddress : undefined;
}
