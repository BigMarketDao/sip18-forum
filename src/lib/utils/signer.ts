import { getLocalStorage, disconnect, isConnected } from '@stacks/connect';

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

export function isLoggedIn() {
	try {
		if (typeof window === 'undefined') return false;
		return isConnected();
	} catch (err) {
		return false;
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
