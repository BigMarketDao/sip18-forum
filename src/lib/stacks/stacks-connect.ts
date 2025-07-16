import { connect, getLocalStorage, disconnect, isConnected } from '@stacks/connect';
import type { GetAddressesResult } from '@stacks/connect/dist/types/methods';

export type AddressObject = {
	stxAddress: string;
	cardinal: string;
	ordinal: string;
	sBTCBalance: number;
	stxBalance?: number;
	bnsNameInfo?: any;
	btcPubkeySegwit0?: string;
	btcPubkeySegwit1?: string;
};

export async function getUserData() {
	try {
		if (typeof window === 'undefined') return;
		const userData = getLocalStorage();
		return userData;
	} catch (err) {
		return;
	}
}

export async function authenticate(callback?: () => void) {
	try {
		const response: GetAddressesResult = await connect({});
		console.log('authenticate: ', response);

		if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
			const stxProvider = localStorage.getItem('STX_PROVIDER');
			console.log('STX Provider from LocalStorage:', stxProvider);
		}

		if (callback) callback();
	} catch (err) {
		console.error('Error in authenticate:', err);
	}
}

export function isLoggedIn() {
	try {
		if (typeof window === 'undefined') return false;
		return isConnected();
	} catch (err) {
		return false;
	}
}

export function getStxAddress() {
	try {
		if (typeof window === 'undefined') return '???';
		const userData = getLocalStorage();
		return userData?.addresses.stx[0].address || '???';
	} catch (err) {
		return '???';
	}
}

export function getBtcAddress() {
	try {
		if (typeof window === 'undefined') return;
		const userData = getLocalStorage();
		return userData?.addresses.btc[0].address || '???';
	} catch (err) {
		return;
	}
}

export function loginStacksFromHeader(document: any) {
	if (typeof window === 'undefined') return false;
	const el = document.getElementById('connect-wallet');
	return el ? el.click() : false;
}

export function logUserOut() {
	if (typeof window === 'undefined') return;
	return disconnect();
}

export function isXverse(): boolean {
	if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
		try {
			const stxProvider = localStorage.getItem('STX_PROVIDER') || '';
			return stxProvider.toLowerCase().includes('xverse');
		} catch (err) {
			return false;
		}
	}
	return false;
}

export function isLeather(): boolean {
	if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
		try {
			const stxProvider = localStorage.getItem('STX_PROVIDER') || '';
			return stxProvider.toLowerCase().includes('leather');
		} catch (err) {
			return false;
		}
	}
	return false;
}
