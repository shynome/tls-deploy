import type { Cookies } from '@sveltejs/kit'

export interface AccessKeyPair {
	accessKeyId: string
	accessKeySecret: string
}

export function pairFromCookies(cookies: Cookies): AccessKeyPair {
	return {
		accessKeyId: cookies.get('ak_id')!,
		accessKeySecret: cookies.get('ak_secret')!,
	}
}
